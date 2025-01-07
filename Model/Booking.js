module.exports = (sequelize,DataTypes) => {
    const Booking = sequelize.define('booking', {
        service: {type: DataTypes.INTEGER, allowNull: false},
        trackid: {type: DataTypes.INTEGER, allowNull: false},
        track: {type: DataTypes.STRING, allowNull: false},
        user: {type: DataTypes.STRING, allowNull: true, defaultValue: 0},
        currentprice: {type: DataTypes.FLOAT, allowNull: false},
        discount: {type: DataTypes.FLOAT, allowNull: false},
        currentprice: {type: DataTypes.FLOAT, allowNull: false},
        duration: {type: DataTypes.STRING, allowNull: false},
        title: {type: DataTypes.STRING, allowNull: false},
        category: {type: DataTypes.STRING, allowNull: false},
        professional: {type: DataTypes.STRING, allowNull: false},
        time: {type: DataTypes.STRING, allowNull: false},
        date: {type: DataTypes.STRING, allowNull: false},
        status: {type: DataTypes.STRING, allowNull: true, defaultValue: 'pending'},
    })

    return Booking
}