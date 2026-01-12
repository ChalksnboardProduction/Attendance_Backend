const { DataTypes } = require('sequelize');
const sequelize = require('../database/db');
const User = require('./User');

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    checkInTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    checkOutTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY'),
        defaultValue: 'ABSENT',
    },
    location: {
        type: DataTypes.JSON, // Stores { lat, lng }
        allowNull: true,
    },
}, {
    tableName: 'attendance',
    timestamps: false,
});

User.hasMany(Attendance, { foreignKey: 'userId' });
Attendance.belongsTo(User, { foreignKey: 'userId' });

module.exports = Attendance;
