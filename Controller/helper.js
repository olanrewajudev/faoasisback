// helpers.js
module.exports = {
    formatPrice: function(price) {
        if (typeof price === 'number') {
            return '₦ ' + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        return price; // Return original value if not a number
    }
};