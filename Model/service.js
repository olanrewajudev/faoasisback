
module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('service', {
        title: {type: DataTypes.STRING, allowNull: false},
        slug: {type: DataTypes.STRING, allowNull: false},
        category: {type: DataTypes.STRING, allowNull: true},
        maincategory: {type: DataTypes.INTEGER, allowNull: true},
        discountprice: {type: DataTypes.STRING, allowNull: true},
        currentprice: {type: DataTypes.STRING, allowNull: false},
        discount: {type: DataTypes.STRING, allowNull: true},
        content: {type: DataTypes.TEXT, allowNull: true},
        duration: {type: DataTypes.TEXT, allowNull: true},
    })

    return Service
}
