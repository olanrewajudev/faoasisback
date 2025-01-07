module.exports = (sequelize, DataTypes) => {
    const Section = sequelize.define('section', {
        title: {type: DataTypes.STRING, required: true},
        slug: {type: DataTypes.STRING, required: true},
        image: {type: DataTypes.STRING, allowNull: true},

    })

    return Section
}