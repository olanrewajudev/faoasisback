const { AddCategory, SingleCartegory, UpdateCategory, AllCategory, DeleteCategory, AllServices, SingleService, CreateServices, UpdateService, FeedAdminDashboard, FetchServiceForUpdating, DeleteService, AllServiceByCategory, AddReview, UpdateReview, deleteReview, AllReview, DuplicateService } = require('../Controller/Service')
const { AdminRoute } = require('../Middleware/Auth')

const router = require('express').Router()
//service
router.get('/', AllServices)
router.get('/single-service/:id', SingleService)
router.post('/new', AdminRoute, CreateServices)
router.post('/update', AdminRoute, UpdateService)
router.get('/fetch-associates/:id', FetchServiceForUpdating)
router.post('/delete-service', AdminRoute, DeleteService)
router.post('/duplicate-service', AdminRoute, DuplicateService)
router.get('/service-cart/:cart', AllServiceByCategory)

//cartegory
router.post('/category/add', AdminRoute, AddCategory)
router.get('/category/:id', SingleCartegory)
router.post('/category/update', AdminRoute, UpdateCategory)
router.get('/category-all', AllCategory)
router.post('/delete-category', AdminRoute, DeleteCategory)
router.get('/all/feed-admin', FeedAdminDashboard)

//review
router.post('/reviews/add-review', AddReview)
router.post('/reviews/update-review', UpdateReview)
router.post('/reviews/delete-review', deleteReview)
router.get('/reviews/review-service', AllReview)

module.exports = router
