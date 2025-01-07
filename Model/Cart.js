module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('cart', {
        service: {type: DataTypes.STRING, allowNull: false},
        user: {type: DataTypes.STRING, allowNull: false},
        price: {type: DataTypes.STRING, allowNull: false},
    })

    return Cart
}