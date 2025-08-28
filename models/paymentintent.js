'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PaymentIntent extends Model {
    static associate(models) {
      PaymentIntent.belongsTo(models.Campaign, { foreignKey: 'campaignId', as: 'campaign' });
    }
  }

  PaymentIntent.init(
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
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provider: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('requires_action', 'processing', 'succeeded', 'failed', 'expired'),
        defaultValue: 'requires_action',
      },
      providerRef: {
        type: DataTypes.STRING,
        unique: true,
      },
      donorEmail: {
        type: DataTypes.STRING,
        validate: { isEmail: true },
      },
      donorName: DataTypes.STRING,
      isAnonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      metadata: DataTypes.JSONB,
      returnUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'PaymentIntent',
      tableName: 'PaymentIntents',
    }
  );

  return PaymentIntent;
};
