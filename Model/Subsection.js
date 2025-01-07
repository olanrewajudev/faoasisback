module.exports = (sequelize, DataTypes) => {
    const Subsection = sequelize.define('subsection', {
        section: {type: DataTypes.INTEGER, required: true},
        price: {type: DataTypes.INTEGER, required: true}
    })

    return Subsection
}