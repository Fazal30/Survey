/**
 * Configuration file for Sequelize
 */
const config = require('./index');

const dbConfig = {
  username: config.DB.USER,
  password: config.DB.PASSWORD,
  database: config.DB.DATABASE,
  host: config.DB.HOST,
  dialect: config.DB.DIALECT,
};

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig,
};
