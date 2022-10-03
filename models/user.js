'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      models.Users.belongsToMany(models.Posts, {
        through: "Likes",
        foreignKey: "userId",
      });
    }
  }
  Users.init({
    userId: {
      type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  provider_uid: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    velogtitle: {
      type: DataTypes.STRING,
    },
    email : {
      type: DataTypes.STRING,
    },
    gitaddress: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};