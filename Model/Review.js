module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('review', {
        content: { type: DataTypes.STRING(1000), allowNull: false },
        rating: { type: DataTypes.STRING, allowNull: false },
        fullname: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING(1000), allowNull: false },
    });
    return Review;
};