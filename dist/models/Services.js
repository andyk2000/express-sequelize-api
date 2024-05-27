"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Service = {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    store_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    }
};
exports.default = Service;
