'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    static associate(models) {
      models.Posts.hasMany(models.Comments, {
        foreignKey: "postId",
      });
      models.Posts.hasMany(models.Images, {
        foreignKey: "postId",
      });
      models.Posts.belongsToMany(models.Users, {
        through: "Likes",
        foreignKey: "postId",
      });
    }
  }
  Posts.init({
    postId: {
      primaryKey: true,
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      allowNull: false 
    },
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    writer: DataTypes.STRING,
    is_saved: { 
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};