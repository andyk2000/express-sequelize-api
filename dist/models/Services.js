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
exports.getServiceBystoreName = exports.getServicesByStore = exports.updateService = exports.deleteService = exports.createService = exports.getServiceID = exports.getServices = exports.initializeService = void 0;
const sequelize_1 = require("sequelize");
class Service extends sequelize_1.Model {
}
const serviceSchema = {
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
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    store_id: {
        type: sequelize_1.DataTypes.INTEGER,
        AllowNull: false,
        references: {
            model: 'stores',
            key: 'id'
        }
    }
};
const initializeService = (sequelize) => {
    Service.init(serviceSchema, {
        sequelize,
        modelName: 'service',
        timestamps: false,
    });
};
exports.initializeService = initializeService;
const getServices = () => __awaiter(void 0, void 0, void 0, function* () {
    const storesData = yield Service.findAll();
    return storesData;
});
exports.getServices = getServices;
const createService = (service) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Service.create(service);
});
exports.createService = createService;
const getServiceID = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceData = yield Service.findOne({
        where: query
    });
    return serviceData;
});
exports.getServiceID = getServiceID;
const deleteService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Service.destroy({
        where: query
    });
});
exports.deleteService = deleteService;
const updateService = (data, query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Service.update(data, {
        where: query
    });
});
exports.updateService = updateService;
const getServicesByStore = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Service.findAll({
        where: query
    });
});
exports.getServicesByStore = getServicesByStore;
const getServiceBystoreName = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Service.findOne({
        where: query
    });
});
exports.getServiceBystoreName = getServiceBystoreName;
