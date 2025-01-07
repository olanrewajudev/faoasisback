const jwt = require('jsonwebtoken')
const User = require('../Model').users

exports.AllRoute = async (req, res, next) => {
    const tokenHeader = req.headers['authorization']
    if(!tokenHeader || !tokenHeader.startsWith('Bearer')) return res.json({status: 400,msg: `Access Denied`})
    const token = tokenHeader.split(' ')[1]
    const verified = jwt.decode(token, process.env.JWT_SECRET)
    if(!verified) return res.json({status: 403, msg: `Your Session has expired or does not exists! kindly navigate to the login page to open a session`})
    const checkUser = await User.findOne({where: {id: verified.id}})
    if(!checkUser) return res.json({status: 404, msg: `Account Session Invalid`})

    req.user = verified.id
    req.role = verified.role 
    next()
}

exports.AdminRoute = async (req, res, next) => {
    const tokenHeader = req.headers['authorization']
    if(!tokenHeader || !tokenHeader.startsWith('Bearer')) return res.json({status: 400,msg: `Access Denied`})
    const token = tokenHeader.split(' ')[1]
    const verified = jwt.decode(token, process.env.JWT_SECRET)
    if(!verified) return res.json({status: 400, msg: `Access Denied`})
    if(verified.role !== 'admin') return res.json({status: 400, msg: `Unauthorized Access`})
    const checkUser = await User.findOne({where: {id: verified.id}})
    if(!checkUser) return res.json({status: 404, msg: `Account Session Invalid`})

    req.user = verified.id 
    next()
}          