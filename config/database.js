const { Sequelize } = require('sequelize');
require('dotenv').config();

// Konfigurasi koneksi database menggunakan URL dari .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
});

module.exports = sequelize;
