'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Wallet.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
      },
      balance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      pin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Wallet',
      tableName: 'Wallets',
    }
  );

  return Wallet;
};
