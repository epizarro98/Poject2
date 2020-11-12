'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category_images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  category_images.init({
    file_name: DataTypes.STRING,
    category_id: DataTypes.INTEGER,
    bytes: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'category_images',
  });
  return category_images;
};