module.exports = (sequelize, DataTypes) => {
    const Professional = sequelize.define('professional', {
        fullname: {type: DataTypes.STRING, allowNull: false},
        role: {type: DataTypes.STRING, allowNull: false, defaultValue: 'therapist'},
        image: {type: DataTypes.STRING, allowNull: true},

    })

    return Professional
}