'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    static associate(models) {
      Donation.belongsTo(models.Campaign, { foreignKey: 'campaignId', as: 'campaign' });
      Donation.belongsTo(models.Donor, { foreignKey: 'donorId', as: 'donor' });
    }
  }

  Donation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      campaignId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      donorId: {
        type: DataTypes.UUID,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAnonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      message: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('pending', 'succeeded', 'failed', 'refunded'),
        defaultValue: 'pending',
      },
      provider: DataTypes.STRING,
      providerRef: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Donation',
      tableName: 'Donations',
    }
  );

  return Donation;
};
