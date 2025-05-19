module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        firstname: { type: DataTypes.STRING, allowNull: false },
        lastname: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'admin' },
        status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'offline' },
        email: { type: DataTypes.STRING, allowNull: false, unique: true }, // Ensure email is unique
        phone: { type: DataTypes.STRING, allowNull: true },
        address: { type: DataTypes.STRING, allowNull: true },
        password: { type: DataTypes.STRING, allowNull: true },
        verified: { type: DataTypes.BOOLEAN, defaultValue: false },
        otp: {type: DataTypes.STRING, allowNull: true,},
        code: {type: DataTypes.STRING, allowNull: true,},
        expires: {type: DataTypes.STRING, allowNull: true,},
    });

    return User;
};