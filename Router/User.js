const { CreateAccount, Login, LogoutAccount, GetSession, GetAdminContact, GetPlatformImages } = require('../Controller/User')
const { AllRoute } = require('../Middleware/Auth')

const router = require('express').Router()

router.post('/create', CreateAccount)
router.post('/login', Login)
router.post('/logout-access', LogoutAccount)
router.get('/get-account', AllRoute, GetSession)
router.get('/super', GetAdminContact)
router.get('/images', GetPlatformImages)

module.exports = router