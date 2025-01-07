const { AllPrice } = require('../Controller/Price')
const { CreateProfessional, UpdateProfessional, DeleteProfessional, AllProfessional, SingleProfessional } = require('../Controller/Professional')
const { AdminRoute } = require('../Middleware/Auth')

const router = require('express').Router()


router.post('/add-professional', AdminRoute, CreateProfessional)
router.get('/all-professional', AllProfessional)
router.get('/single-professional/:id', SingleProfessional)
router.post('/update-professional/:id', AdminRoute, UpdateProfessional)
router.post('/delete-professional', AdminRoute, DeleteProfessional)


module.exports = router