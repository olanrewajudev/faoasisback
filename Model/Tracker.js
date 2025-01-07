module.exports = (sequelize, DataTypes) => {
    const Tracker = sequelize.define('tracker', {
        track_url: {type: DataTypes.STRING, allowNull: false},
        trackid: { type: DataTypes.STRING, allowNull: false },
        fullname: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: true },
        address: { type: DataTypes.STRING, allowNull: true },
    })

    return Tracker
}