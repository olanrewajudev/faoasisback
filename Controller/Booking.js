const Tracker = require('../Model').trackers
const Booking = require('../Model').bookings
const Service = require('../Model').services
const Category = require('../Model').categories
const User = require('../Model').users
const otpGenerator = require('otp-generator')
const Mailsender = require('../Config/EmailConfig/mail')

const exphbs = require("./handlebarsSetup"); // Handlebars setup
const path = require("path");
const { readFileSync } = require("fs");


exports.generateMultipleBooking = async (req, res) => {
    try {
        const { services, fullname, email, phone, address, total } = req.body;
        console.log("Request Body:", req.body);

        if (!services || services.length < 1) {
            return res.json({ status: 400, msg: `Invalid order request` });
        }

        const findAdmin = await User.findOne({ where: { role: 'admin' } });
        if (!findAdmin) {
            return res.json({ status: 400, msg: `No Admin available yet to receive your order!...` });
        }

        const mainuser = req.user || null;
        const serviceurldata = otpGenerator.generate(20, { specialChars: false });
        const serviceUrl = `${serviceurldata}`;
        const newTrack = { track_url: serviceUrl, trackid: serviceurldata, user: mainuser, fullname, email, phone, address, total };

        const tracker = await Tracker.create(newTrack);

        const bookings = await Promise.all(
            services.map(async (item) => {
                const dataitem = await Service.findOne({
                    where: { id: item.service },
                    include: [
                        { model: Category, as: 'cart' },
                    ],
                });

                const currPrice = dataitem.discountprice || dataitem.currentprice;

                const newBooking = {
                    trackid: tracker.track_url,
                    track: tracker.trackid,
                    time: item.time,
                    date: item.date,
                    duration: item.duration,
                    professional: item.professional,
                    service: item.service,
                    discount: item.discount,
                    currentprice: currPrice,
                    discountprice: item.discountprice,
                    price: item.pricing,
                    title: item.servicename,
                    category: item.category,
                    status: `pending`
                };

                await Booking.create(newBooking);
                return newBooking; // Return the booking for sending in the response
            })
        );

        const sendUser = {
            fullname: fullname,
            email: email,
            address: address,
            track: tracker.trackid,
            bookings: bookings,// Include the bookings in the response
            total: total,  // Include the bookings in the response
        };

        // Render Handlebars template
        const templatePath = path.join(__dirname, "views", "emails", "booking.hbs");
        const emailHtml = await exphbs(templatePath, {
            fullname,
            total,
            bookings, // Pass bookings to the email template if needed
            trackid: tracker.trackid,
            year: new Date().getFullYear(),
        });

        // Send email to the user
        await Mailsender(email, emailHtml, "Your Booking Confirmation");

        // Send email to the company
        const companyEmail = "f.afinnesseoasis@gmail.com";
        // const companyEmail = "olagitdev@gmail.com";
        await Mailsender(companyEmail, emailHtml, "New Booking Received");

        return res.json({ status: 200, msg: 'Booking created Successfully!...', order: sendUser });
    } catch (error) {
        console.error("Error in generateMultipleBooking:", error);
        return res.json({ status: 400, msg: `Error: ${error.message}` });
    }
};
exports.generateSingleBooking = async (req, res) => {
    try {
        const { services, link, fullname, email, phone, address, } = req.body
        const user = req.user
        if (!link || services.length < 1) return res.json({ status: 400, msg: `Invalid order request` })

        const findAdmin = await User.findOne({ where: { role: 'admin' } })
        if (!findAdmin) return res.json({ status: 400, msg: `No Admin available yet to recieve your order!...` })

        const mainuser = user || null
        const serviceurldata = otpGenerator.generate(20, { specialChars: false })
        const serviceUrl = `${link}/services/${serviceurldata}`
        const newTrack = { trackid: serviceurldata, user: null, fullname, email, phone: phone, address }
        const tracker = await Tracker.create(newTrack)

        await services.map(async (item) => {
            const newBooking = {
                trackid: tracker.id,
                date: item.date,
                time: item.time,
                professional: item.professional,
                time: item.time,
                service: item.service,
                user: user,
                discount: item.discount,
                currentprice: item.currPrice,
                name: item.servicename,
                category: item.category,
                status: `pending`
            }
            await Booking.create(newBooking)
        })

        const sendUser = {
            fullname: fullname,
            email: email,
            address: address,
            track: tracker.trackid
        }
        return res.json({ status: 200, msg: 'order created Successfully!...', order: sendUser })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}
exports.VerifyBookingCode = async (req, res) => {
    try {
        const { trackid } = req.body
        if (!trackid) return res.json({ status: 400, msg: `Incomplete Information provided` })

        const track = await Tracker.findOne({ where: { trackid: trackid } })
        if (!track) return res.json({ status: 403, msg: `track id does not exists!...` })

        const orders = await Booking.findAll({
            where: { track: track.trackid },
            include: [
                { model: Service, as: 'orders' },
            ]
        })

        if (orders.length < 1) return res.json({ status: 400, msg: `No order found!...` })


        return res.json({ status: 200, msg: 'Track id found successfully', orders })
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}

exports.GetAllBookings = async (req, res) => {
    try {
        const { track } = req.params
        const item = await Tracker.findOne({
            where: { trackid: track }
        })

        if (!item) return res.json({ status: 400, msg: `Tracker ddd not found!...` })

        const orders = await Booking.findAll({
            where: { trackid: item.trackid },
            include: [
                { model: Service, as: 'orders' },
            ]
        })

        if (orders.length < 1) return res.json({ status: 400, msg: `No order found!...` })

        return res.json({ status: 200, msg: orders })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}

exports.UpdateBookingStatus = async (req, res) => {
    try {
        const { id, status } = req.body
        const order = await Booking.findOne({ where: { id: id } })
        if (!order) return res.json({ status: 404, msg: `Booking Not Found` })
        order.status = status
        await order.save()

        return res.json({ status: 200, msg: `Booking Updated` })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}

exports.AdminGetAllBookings = async (req, res) => {
    try {
        const orders = await Booking.findAll({
            order: [['createdAt', 'DESC']]
        })

        if (!orders) return res.json({ status: 404, msg: `No Booking found yet!..` })

        return res.json({ status: 200, msg: orders })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}

exports.AdmingetAllTracks = async (req, res) => {
    try {
        const items = await Tracker.findAll({
            order: [['createdAt', 'DESC']]
        })

        return res.json({ status: 200, msg: items })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}
