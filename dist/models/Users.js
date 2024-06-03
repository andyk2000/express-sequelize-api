"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserEmail = exports.updateUser = exports.deleteUser = exports.getUserID = exports.getUsers = exports.createUser = exports.initializeUser = void 0;
const sequelize_1 = require("sequelize");
// Define the User model class
class User extends sequelize_1.Model {
}
// Define the user model schema
const userSchema = {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    names: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "customer",
    }
};
const initializeUser = (sequelize) => {
    User.init(userSchema, {
        sequelize,
        modelName: 'user',
        timestamps: false,
    });
};
exports.initializeUser = initializeUser;
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.create(user);
});
exports.createUser = createUser;
const getUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const usersData = yield User.findAll();
    return usersData;
});
exports.getUsers = getUsers;
const getUserID = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield User.findOne({
        where: query
    });
    return userData;
});
exports.getUserID = getUserID;
const getUserEmail = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield User.findOne({
        where: query
    });
    return userData;
});
exports.getUserEmail = getUserEmail;
const deleteUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.destroy({
        where: query
    });
});
exports.deleteUser = deleteUser;
const updateUser = (data, query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User.update(data, {
        where: query
    });
});
exports.updateUser = updateUser;
