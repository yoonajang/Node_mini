'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Likes.belongsTo(models.Users, {
        foreignKey: "userId",
      });
      models.Likes.belongsTo(models.Posts, {
        foreignKey: "postId",
      });
    }
  }
  Like.init({
    likeId: { primaryKey: true, 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      allowNull: false 
    },
    userId: {
    type: DataTypes.STRING,
    allowNull: false,
    },
    postId: {
    type: DataTypes.INTEGER,
    allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Likes',
  });
  return Like;
};