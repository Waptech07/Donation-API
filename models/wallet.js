'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Wallet extends Model {
        static associate(models) {
            // Defines the association between Wallet and User
            Wallet.belongsTo(models.User, { foreignKey: 'userId' });
        }
    }
    Wallet.init(
        {
            // Unique UUID for each wallet
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            // userId is the foreign key that references User
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,  // Ensures each user can have only one wallet
            },
            // Initial balance, defaults to 0
            balance: {
                type: DataTypes.FLOAT,
                defaultValue: 0,
            },
            // Encrypted PIN for the wallet
            pin: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Wallet',
            tableName: 'Wallets',  // Table name in the database
        }
    );
    return Wallet;
};
