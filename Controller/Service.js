const slug = require('slug');
const Service = require('../Model').services
const Category = require('../Model').categories
const Review = require('../Model').reviews
const User = require('../Model').users
const Professional = require('../Model').professionals
const Price = require('../Model').prices
const Section = require('../Model').sections

//services
exports.CreateServices = async (req, res) => {
    try {
        const { title, maincategory, category, content, discount, discountprice, currentprice, duration } = req.body;

        // Validate required fields
        if (!title) return res.status(400).json({ status: 400, msg: `Title is required` });
        if (!maincategory) return res.status(400).json({ status: 400, msg: `Main category is required` });
        if (!currentprice) return res.status(400).json({ status: 400, msg: `Current price is required` });
        if (!content) return res.status(400).json({ status: 400, msg: `Content is required` });
        if (!duration) return res.status(400).json({ status: 400, msg: 'Duration is required' });

       
        const ServiceSlug = slug(title, '_');

        const newService = {
            title,
            category,
            discountprice,
            maincategory,
            currentprice,
            content,
            discount,
            slug: ServiceSlug,
            duration,
        };
        await Service.create(newService);

        return res.status(200).json({ status: 200, msg: 'Service created successfully' });
    } catch (error) {
        console.error('Error creating service:', error);
        return res.status(500).json({ status: 500, msg: `Error: ${error.message}` });
    }
};
exports.UpdateService = async (req, res) => {
    try {
        const { title, category, discountprice, serviceid, maincategory, currentprice, content, discount, duration } = req.body
        if (!title || !maincategory || !currentprice || !content || !duration) return res.json({ status: 400, msg: `Incomplete service details detected!.` })

        const serviceSlug = slug(title, '_')
        const service = await Service.findOne({
            where: { id: serviceid },
        })

        if (!service) return res.json({ status: 400, msg: `Service not found!...` })

        service.title = title
        service.slug = serviceSlug
        service.category = category
        service.maincategory = maincategory
        service.discountprice = discountprice
        service.currentprice = currentprice
        service.content = content
        service.discount = discount
        service.duration = duration
        await service.save()

        return res.json({ satus: 200, msg: `service Updated Successfully` })
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}
exports.FetchServiceForUpdating = async (req, res) => {
    try {
        const { id } = req.params
        const service = await Service.findOne({
            where: { id: id },
            include: [
                { model: Category, as: 'cart' },
            ],
        })
        if (!service) return res.json({ status: 400, msg: `service not found!.` })

        const allcarts = await Category.findAll({})

        return res.json({ status: 200, service, allcarts })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}

exports.AllServiceByCategory = async (req, res) => {
    try {
        const { cart } = req.params
        const items = await Service.findAll({
            where: { maincategory: cart },
            order: [['createdAt', 'DESC']],
            include: [
                { model: Category, as: 'cart' },
            ],
        })

        const item = await Category.findOne({ where: { id: cart } })
        if (!item) return res.json({ status: 404, msg: `Category not found` })

        return res.json({ status: 200, msg: items, category: item })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}
exports.DuplicateService = async (req, res) => {
    try {
        const { id } = req.body
        const service = await Service.findOne({
            where: { id: id },

        })
        if (!service) return res.json({ status: 404, msg: `price Not Found` })

        const serviceSlug = slug(service.title, '_')
        const newService = { slug: serviceSlug, title: service.title, category: service.category, discountprice: service.discountprice, maincategory: service.maincategory, currentprice: service.currentprice, content: service.content, discount: service.discount, duration: service.duration }
        await Service.create(newService)

        return res.json({ status: 200, msg: `Service Duplicated Successfully!...` })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}

exports.AllServices = async (req, res) => {
    try {
        const items = await Service.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { model: Category, as: 'cart' },
            ],
        })

        return res.json({ status: 200, msg: items })
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}

exports.SingleService = async (req, res) => {
    try {
        const { id } = req.params
        const items = await Service.findOne({
            where: { id: id },
            include: [
                { model: Category, as: 'cart' },
            ],
        })
        if (!items) return res.json({ status: 400, msg: `Service not found!.` })
        const allcarts = await Category.findAll({})

        return res.json({ status: 200, msg: items, allcarts })

    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}
exports.DeleteService = async (req, res) => {
    try {
        const { id } = req.body
        const ser = await Service.findByPk(id)
        if (!ser) return res.json({ status: 404, msg: `category not found` })

        const service = await Service.findAll({ where: { maincategory: ser.id } })
        if (service) {
            service.map(async (data) => {
                data.service = null
                data.mainservice = null
                await data.save()
            })
        }
        await ser.destroy()

        return res.json({ status: 200, msg: `services Successfully Deleted!...` })
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}

//Categories
exports.AddCategory = async (req, res) => {
    try {

        const { title } = req.body
        if (!title) return res.json({ status: 40, msg: `Category title is required` })

        const catslug = slug(title, '_')
        await Category.create({ title, slug: catslug })

        return res.json({ status: 200, msg: 'category created successfully' })
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}

exports.UpdateCategory = async (req, res) => {
    try {
        const { title, id } = req.body
        if (!title) return res.json({ status: 40, msg: `Category title is required` })

        const item = await Category.findOne({ where: { id: id } })
        if (!item) return res.json({ status: 400, msg: `category not found!.` })

        const catslug = slug(title, '_')
        item.title = title
        item.slug = catslug
        await item.save()

        return res.json({ status: 200, msg: 'category updated successfully' })
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}

exports.DeleteCategory = async (req, res) => {
    try {
        const { id } = req.body
        const cat = await Category.findByPk(id)
        if (!cat) return res.json({ status: 404, msg: `category not found` })

        const service = await Service.findAll({ where: { maincategory: cat.id } })
        if (service) {
            service.map(async (data) => {
                data.category = null
                data.maincategory = null
                await data.save()
            })
        }
        await cat.destroy()

        return res.json({ status: 200, msg: `Category Successfully Deleted!...` })
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}
exports.AllCategory = async (req, res) => {
    try {
        const items = await Category.findAll({
            order: [['createdAt', 'DESC']],
        })
        return res.json({ status: 200, msg: items })
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}

exports.SingleCartegory = async (req, res) => {
    try {
        const { id } = req.params
        const item = await Category.findOne({ where: { id: id } })
        if (!item) return res.json({ status: 400, msg: `category not found` })

        return res.json({ statsu: 200, msg: item })
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}

exports.FeedAdminDashboard = async (req, res) => {
    try {
        const Services = await Service.findAll({})
        const category = await Category.findAll({})
        const reviews = await Review.findAll({})
        const users = await User.findAll({})
        const prices = await Price.findAll({})
        const sections = await Section.findAll({})
        const professionals = await Professional.findAll({})

        let items = [
            { tag: 'services', total: Services.length, bg: `green` },
            { tag: 'categories', total: category.length, bg: `teal` },
            { tag: 'reviews', total: reviews.length, bg: `blue` },
            { tag: 'users', total: users.length, bg: `cyan` },
            { tag: 'prices', total: prices.length, bg: `cyan` },
            { tag: 'sections', total: sections.length, bg: `gold` },
            { tag: 'professionals', total: professionals.length, bg: `gray` },
        ]
        return res.json({ status: 200, msg: items })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}

//reviews

exports.AddReview = async (req, res) => {
    try {
        const { rating, content, status, fullname } = req.body
        if (!content || !status || !fullname) return res.json({ status: 400, msg: `Incomplete information provided` })

        const newItem = { fullname: fullname, rating, content, status }
        await Review.create(newItem)

        return res.json({ status: 200, msg: `Review Added` })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}

exports.UpdateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, content, status, fullname } = req.body;
        if (!fullname || !rating || !content || !status) {
            return res.json({ status: 400, msg: 'Incomplete information provided' });
        }

        const item = await Review.findOne({ where: { id } });
        if (!item) {
            return res.json({ status: 400, msg: 'Review not found' });
        }

        item.fullname = fullname;
        item.rating = rating;
        item.content = content;
        item.status = status;

        await item.save();

        return res.json({ status: 200, msg: 'Update successfully saved' });
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.body
        const item = await Review.findByPk(id)
        if (!item) return res.json({ status: 400, msg: `review not found` })

        await item.destroy()

        return res.json({ status: 200, msg: `review deleted` })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}

exports.AllReview = async (req, res) => {
    try {
        const item = await Review.findAll({})

        return res.json({ status: 200, msg: item })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}
