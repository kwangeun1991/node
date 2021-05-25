const Sequelize = require('sequelize'); // 생성자

const env = process.env.NODE_ENV || 'development';

const config = require('../config/config')[env];

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config); // 인스턴스

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
