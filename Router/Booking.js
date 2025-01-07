const { generateSingleBooking, generateMultipleBooking, GetAllBookings, AdminGetAllBookings, AdmingetAllTracks, UpdateBookingStatus, VerifyBookingCode } = require("../Controller/Booking")
const { AdminRoute } = require("../Middleware/Auth")

const router = require("express").Router()
router.post('/generate-booking', generateSingleBooking)
router.post('/generate-multiple-booking', generateMultipleBooking)
router.get('/booking/:track', GetAllBookings)
router.get('/all-bookings', AdminGetAllBookings)
router.post('/verify-code', VerifyBookingCode)
router.get('/tracks/all', AdmingetAllTracks)
router.post('/update-booking', AdminRoute, UpdateBookingStatus)

module.exports = router