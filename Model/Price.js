module.exports = (sequelize, DataTypes) => {
    const Price = sequelize.define('price', {
        service: { type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.STRING, allowNull: false },
        maincategory: { type: DataTypes.INTEGER, allowNull: true },
        priceamount: { type: DataTypes.INTEGER, allowNull: false },
        slug: {type: DataTypes.STRING, allowNull: false},
    })
    return Price
}