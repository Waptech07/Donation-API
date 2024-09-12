'use strict';
const { Model } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); // For generating UUIDs

module.exports = (sequelize, DataTypes) => {
    class Donation extends Model {
        static associate(models) {
            Donation.belongsTo(models.User, { foreignKey: 'userId' });
            Donation.belongsTo(models.User, { foreignKey: 'beneficiaryId', as: 'beneficiary' });
        }
    }
    Donation.init(
        {
            // Unique transaction ID for each donation
            transactionId: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                unique: true,
            },
            amount: DataTypes.FLOAT,
            userId: DataTypes.INTEGER,
            beneficiaryId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Donation',
            tableName: 'Donations', // Ensure this matches the table name in the migration
        }
    );

    // Assign a UUID before creating the donation
    Donation.beforeCreate((donation) => {
        donation.transactionId = uuidv4(); // Automatically assign UUID
    });

    return Donation;
};
