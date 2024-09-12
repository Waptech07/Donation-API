require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL_DEV,
    dialect: process.env.DB_DIALECT
  },
  test: {
    url: process.env.DATABASE_URL_TEST,
    dialect: process.env.DB_DIALECT
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: process.env.DB_DIALECT
  }
};
