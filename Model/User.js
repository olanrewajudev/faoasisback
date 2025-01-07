module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        firstname: {type: DataTypes.STRING, allowNull: false},
        lastname: {type: DataTypes.STRING, allowNull: false},
        role: {type: DataTypes.STRING, allowNull: false, defaultValue: 'admin'},
        status: {type: DataTypes.STRING, allowNull: false, defaultValue: 'offline'},
        email: {type: DataTypes.STRING, allowNull: false},
        phone: {type: DataTypes.STRING, allowNull: true},
        address: {type: DataTypes.STRING, allowNull: true},
        pass: {type: DataTypes.STRING, allowNull: true},
        password: {type: DataTypes.STRING, allowNull: true},
    })

    return User
}