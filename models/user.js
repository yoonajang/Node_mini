'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.Users.hasMany(models.Posts, {
      //   foreignKey: "userId",
      // });
      // models.Users.hasMany(models.Comments, {
      //   foreignKey: "userId",
      // });
      models.Users.belongsToMany(models.Posts, {
        through: "Likes",
        foreignKey: "userId",
      });
    }
  }
  Users.init({
    // id: {
    //   type: DataTypes.INTEGER, 
    //   autoIncrement: true, 
    // },
    userId: {
      type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
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