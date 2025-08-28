'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Wallet, { foreignKey: 'userId', as: 'wallet' });
      User.hasMany(models.Campaign, { foreignKey: 'ownerId', as: 'campaigns' });
    }

    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users',
    }
  );

  // Hash password before saving
  User.beforeCreate((user) => {
    user.password = bcrypt.hashSync(user.password, 10);
  });

  return User;
};
