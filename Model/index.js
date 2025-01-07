const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../Config/db-config');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    operatorsAliases: false,
    pool: {
        max: dbConfig.max,
        min: dbConfig.min,
        idle: dbConfig.idle,
        acquire: dbConfig.acquire,
    }
});

sequelize.authenticate()
    .then(() => console.log('server connected'))
    .catch((error) => console.log(`server error ${error}`));

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Import models
db.categories = require('./Category')(sequelize, DataTypes);
db.bookings = require('./Booking')(sequelize, DataTypes);
db.trackers = require('./Tracker')(sequelize, DataTypes);
db.services = require('./service')(sequelize, DataTypes);
db.users = require('./User')(sequelize, DataTypes);
db.reviews = require('./Review')(sequelize, DataTypes);
db.carts = require('./Cart')(sequelize, DataTypes);
db.prices = require('./Price')(sequelize, DataTypes);
db.sections = require('./Section')(sequelize, DataTypes);
db.subsections = require('./Subsection')(sequelize, DataTypes);
db.professionals = require('./Professional')(sequelize, DataTypes);

// // Define associations
db.categories.hasMany(db.services, { foreignKey: 'maincategory', as: 'cart' });
db.prices.hasMany(db.categories, { foreignKey: 'price', as: 'cartegory' });
db.sections.hasMany(db.subsections, { foreignKey: 'section', as: 'secs' });
db.prices.hasMany(db.subsections, { foreignKey: 'price', as: 'secprice' });
db.services.hasMany(db.bookings, {foreignKey: 'service', as: 'orders'})
db.users.hasMany(db.trackers, {foreignKey: 'user', as: 'track'})

// Many to one relationships
db.services.belongsTo(db.categories, { foreignKey: 'maincategory', as: 'cart' });
db.prices.belongsTo(db.categories, { foreignKey: 'price', as: 'cart' });
db.subsections.belongsTo(db.sections, {foreignKey: 'section', as: 'secs'})
db.subsections.belongsTo(db.prices, {foreignKey: 'price', as: 'secprice'})
db.bookings.belongsTo(db.services, {foreignKey: 'service', as: 'orders'})
db.trackers.belongsTo(db.users, {foreignKey: 'user', as: 'track'})

db.sequelize.sync({ force: false }).then(() => console.log('re-sync done.'));

module.exports = db;
