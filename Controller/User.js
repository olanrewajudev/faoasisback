const User = require('../Model').users
const Category = require('../Model').categories
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.CreateAccount = async (req, res) => {
    try {
        const { firstname, lastname, email, password, confirm_password, phone } = req.body
        if (!firstname || !lastname || !email || !password || !confirm_password || !phone) return res.json({ status: 400, msg: `Incomplete Request detected` })
        if (password.length < 6) return res.json({ status: 400, msg: `Password must be at least 6 characters` })
        if (confirm_password !== password) return res.json({ status: 400, msg: `Password(s) do not match` })

        const checkAdmin = await User.findOne({ where: { email: email } })
        if (checkAdmin) return res.json({ status: 400, msg: `Email Address already exists!..` })

        const pass = password
        const getSalt = await bcrypt.genSaltSync(15)
        const newpass = await bcrypt.hashSync(password, getSalt)
        const newAdmin = { firstname, lastname, email, phone, pass, password: newpass, role: 'admin' }
        const user = await User.create(newAdmin)
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '0.1d' })

        return res.json({ status: 200, msg: `Session Created Successfully`, token })
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.json({ status: 400, msg: `Incomplete Information provided` })
        const user = await User.findOne({ where: { email: email } })
        if (!user) return res.json({ status: 403, msg: `Account does not exists!...` })

        const checkpass = await bcrypt.compareSync(password, user.password)
        if (!checkpass) return res.json({ status: 400, msg: `Wrong password detected` })

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '0.1d' })
        return res.json({ status: 200, msg: 'account login successfully', token })
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}
exports.GetAdminContact = async (req, res) => {
    try {
        const user = await User.findOne({ where: { role: 'admin' } })
        if (!user) return res.json({ status: 200, msg: { phone: false } })

        const detail = {
            phone: `${user.phone}`
        }

        return res.json({ status: 200, msg: detail })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}
exports.LogoutAccount = async (req, res) => {
    try {
        const token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '0s' })

        return res.json({ status: 200, msg: 'Logged Out', token })
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}

exports.GetSession = async (req, res) => {
    try {
        const user = await User.findOne({ where: { id: req.user } })
        if (!user) return res.json({ status: 400, msg: `User not found` })
        return res.json({ status: 200, msg: user })
    } catch (error) {
        return res.json({ status: 400, msg: `error ${error}` })
    }
}


exports.GetPlatformImages = async (req, res) => {
    try {
        const admin = await User.findOne({ where: { role: 'admin' } })
        if (!admin) return res.json({ status: 404, msg: 'Not found' })
        const info = {
            phone: `${admin.phone}`,
            email: admin.email
        }
        const items = await Category.findAll({
            order: [['createdAt', 'DESC']],
        })

        return res.json({ status: 200, msg: info, categories: items,  })
    } catch (error) {
        return res.json({ status: 400, msg: `Error ${error}` })
    }
}

