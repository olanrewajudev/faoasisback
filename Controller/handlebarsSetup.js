const { engine } = require('express-handlebars');
const helpers = require('./helper'); // Adjust the path as necessary

// Create the handlebars engine with the specified options
const exphbs = engine({
    extname: '.hbs', // Specify the file extension
    helpers: helpers, // Register helpers here
    defaultLayout: false, // Specify a default layout if you have one
});

// Export the configured engine
module.exports = exphbs;