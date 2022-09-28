'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    static associate(models) {
      models.Comments.belongsTo(models.Posts, {
        foreignKey: "postId",
      });
    }
  }
  Comments.init({
    commentId: {
       primaryKey: true, 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      allowNull: false 
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
      },
    comment: DataTypes.STRING,
    writer: {
      type: DataTypes.STRING,
      allowNull: false
      },
  }, {
    sequelize,
    modelName: 'Comments',
  });
  return Comments;
};