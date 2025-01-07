const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config()

const app = express()

const port = process.env.PORT || 4000

app.use(cors({
    origin: ['http://localhost:5173', 'https://finesseoasis.com.ng', 'http://localhost:5174']
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(fileUpload());
app.use(express.static('public'))
app.use('/api/service', require('./Router/Service'))
app.use('/api/user', require('./Router/User'))
app.use('/api/price', require('./Router/Price'))
app.use('/api/professional', require('./Router/Professional'))
app.use('/api/booking', require('./Router/Booking'))
app.listen(port, () => { console.log(`this server is runnig on localhost: ${port}`) })

