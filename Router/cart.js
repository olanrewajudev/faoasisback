const { UserAddToCart, DeleteCartItem, GetMyCart } = require("../Controller/Cart")

const router = require("express").Router()

router.post('/cart/add-cart', UserAddToCart)
router.post('/cart/delete-cart', DeleteCartItem)
router.get('/cart/get-carts/:id', GetMyCart)



module.exports = router