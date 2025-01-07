

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('category', {
        title: { type: DataTypes.STRING },
        slug: { type: DataTypes.STRING },
    })

    return Category
}