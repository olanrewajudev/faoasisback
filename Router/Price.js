
const { AddNewPrice, UpdatePrice, GetSinglePrice, DeletePrice, AddNewSection, DeleteSection, UpdateSection, SingleSectionForUpdating, AllSections, GetHomeSections, AllPrice, DuplicatePrice, DuplicateSection } = require('../Controller/Price')

const router = require('express').Router()

const { AdminRoute } = require('../Middleware/Auth')

router.post('/new-price',AdminRoute, AddNewPrice)
router.post('/update-price', AdminRoute, UpdatePrice)
router.get('/price', AllPrice)
router.get('/single-price/:id', GetSinglePrice)
router.delete('/delete-price/:id', DeletePrice)
router.post('/duplicate', AdminRoute, DuplicatePrice)

//section
router.post('/add-section', AdminRoute, AddNewSection)
router.get('/all-sections', AllSections)
router.get('/single-updating/:id', AdminRoute, SingleSectionForUpdating)
router.post('/update-section', AdminRoute, UpdateSection)
router.post('/delete-section', AdminRoute, DeleteSection)
router.get('/get-home-price', GetHomeSections)

module.exports = router