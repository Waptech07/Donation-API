'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Campaign extends Model {
    static associate(models) {
      Campaign.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
      Campaign.hasMany(models.Donation, { foreignKey: 'campaignId', as: 'donations' });
      Campaign.hasMany(models.PaymentIntent, { foreignKey: 'campaignId', as: 'paymentIntents' });
    }
  }

  Campaign.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      coverImageUrl: DataTypes.STRING,
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'NGN',
      },
      goalAmount: DataTypes.INTEGER,
      totalRaised: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Campaign',
      tableName: 'Campaigns',
    }
  );

  return Campaign;
};
