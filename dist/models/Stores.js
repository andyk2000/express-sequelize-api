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
exports.getStoreByName = exports.getStoreInfo = exports.getstoresForCustomer = exports.getStoreOwner = exports.updateStore = exports.deleteStore = exports.createStore = exports.getStoreID = exports.getStores = exports.initializeStore = void 0;
const sequelize_1 = require("sequelize");
class Store extends sequelize_1.Model {
}
const storeSchema = {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    owner_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "users",
            key: "id",
        }
    },
    storeUrl: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    }
};
const initializeStore = (sequelize) => {
    Store.init(storeSchema, {
        sequelize,
        modelName: 'store',
        timestamps: false,
    });
};
exports.initializeStore = initializeStore;
const getStores = () => __awaiter(void 0, void 0, void 0, function* () {
    const storesData = yield Store.findAll();
    return storesData;
});
exports.getStores = getStores;
const createStore = (store) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Store.create(store);
});
exports.createStore = createStore;
const getStoreID = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const storeData = yield Store.findOne({
        where: query
    });
    return storeData;
});
exports.getStoreID = getStoreID;
const deleteStore = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Store.destroy({
        where: query
    });
});
exports.deleteStore = deleteStore;
const updateStore = (data, query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Store.update(data, {
        where: query
    });
});
exports.updateStore = updateStore;
const getStoreOwner = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const stores = yield Store.findAll({
        where: query
    });
    return stores;
});
exports.getStoreOwner = getStoreOwner;
const getstoresForCustomer = () => __awaiter(void 0, void 0, void 0, function* () {
    const stores = yield Store.findAll({
        attributes: ['name', 'address', 'description', 'storeUrl']
    });
    return stores;
});
exports.getstoresForCustomer = getstoresForCustomer;
const getStoreInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    const stores = yield Store.findAll({
        attributes: ['id', 'storeUrl']
    });
    return stores;
});
exports.getStoreInfo = getStoreInfo;
const getStoreByName = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const store = yield Store.findOne({
        where: query
    });
    return store;
});
exports.getStoreByName = getStoreByName;
