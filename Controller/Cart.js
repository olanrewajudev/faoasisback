const User = require('../Model').users
const Cart = require('../Model').carts

exports.UserAddToCart = async (req, res) => {
    try {
        const { name, price, duration, quantity, } = req.body
if(!name || !price || !duration || !quantity) return res.json({status: 400, msg: 'incomplete info'})
        let findUser = await User.findOne({ where: {} })
        if (!findUser) {
            const newUser = {}
            findUser = await User.create(newUser)
        }

        const checkCart = await Cart.findOne({ where: {} })
        if (checkCart) return res.json({ status: 400, msg: `service already added in your cart!...` })

        const newCart = {}
        await Cart.create(newCart)

        return res.json({ status: 200, msg: `Item Added to cart` })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}

exports.GetMyCart = async (req, res) => {
    try {
        const { } = req.params

        return res.json({ status: 200, msg: findCarts })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}

exports.DeleteCartItem = async (req, res) => {
    try {
        const { id } = req.body
        const finditem = await Cart.findOne({ where: { id: id } })
        if (!finditem) return res.json({ status: 404, msg: `Cart item  not found!...` })
        await finditem.destroy()

        return res.json({ status: 200, msg: 'service successfully removed from cart', carts: items })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}
