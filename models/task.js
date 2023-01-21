'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Task.init({
    time: DataTypes.STRING,
    channel_id: DataTypes.INTEGER,
    coin_id: DataTypes.INTEGER,
    country_id: DataTypes.INTEGER,
    timezone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};
