const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const { engine } = require('express-handlebars'); // Import express-handlebars
const exphbs = require('./Controller/handlebarsSetup'); // Adjust the path as necessary

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Setup Handlebars as the view engine
app.engine('hbs', engine({
    extname: '.hbs', // Specify the file extension
    defaultLayout: false // You can specify a default layout if you have one
}));
app.set('view engine', 'hbs');

// Middleware setup
app.use(cors({
    origin: [
        'http://localhost:5174',
        'https://finesseoasis.com.ng',
        'http://http://192.168.0.186:5174',
        'https://oasis-front.netlify.app'
    ]
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));
app.engine('hbs', exphbs);
app.set('view engine', 'hbs');
// Route imports
app.use('/api/service', require('./Router/Service'));
app.use('/api/user', require('./Router/User'));
app.use('/api/price', require('./Router/Price'));
app.use('/api/professional', require('./Router/Professional'));
app.use('/api/booking', require('./Router/Booking'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// The generateMultipleBooking function can remain as is