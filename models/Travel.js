const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Travel = sequelize.define('Travel', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    judulPerjalanan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cerita: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'googleId'
        }
    }
}, {
    tableName: 'Travels'
});

module.exports = Travel;
