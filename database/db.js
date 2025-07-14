const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();
console.log("===================================================== ",process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.env.DB_HOST, process.env.DB_PORT);
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
});

module.exports = sequelize;
