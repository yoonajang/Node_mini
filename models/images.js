'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Images extends Model {
    static associate(models) {
      models.Images.belongsTo(models.Posts, {
        foreignKey: "postId",
      });
    }
  }
  Images.init({
    ImageId: { primaryKey: true, 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      allowNull: false 
    },
    postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    },
    imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Images',
  });
  return Images;
};