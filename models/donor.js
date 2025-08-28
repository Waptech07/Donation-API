'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Donor extends Model {
    static associate(models) {
      Donor.hasMany(models.Donation, { foreignKey: 'donorId', as: 'donations' });
    }
  }

  Donor.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: { isEmail: true },
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Donor',
      tableName: 'Donors',
    }
  );

  return Donor;
};
