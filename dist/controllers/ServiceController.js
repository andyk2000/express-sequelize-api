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
exports.updateServiceData = exports.deleteServiceData = exports.getServiceByID = exports.getAllServices = exports.createNewService = void 0;
const Services_1 = require("../models/Services");
const createNewService = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, store_id } = request.body;
    try {
        const data = yield (0, Services_1.createService)({ name, price, store_id });
        return response.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createNewService = createNewService;
const getAllServices = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, Services_1.getServices)();
        return response.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send("faild to get the data");
    }
});
exports.getAllServices = getAllServices;
const getServiceByID = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id);
    try {
        const storeData = yield (0, Services_1.getServiceID)({ id: id });
        return response.status(200).json(storeData);
    }
    catch (err) {
        console.log(err);
        response.status(500).send(`failed to get service with id${id}`);
    }
});
exports.getServiceByID = getServiceByID;
const deleteServiceData = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id);
    try {
        const deletedService = yield (0, Services_1.deleteService)({ id: id });
        return response.status(200).json(deletedService);
    }
    catch (error) {
        console.log(error);
        response.status(200).json(`failed to delete service with id${id}`);
    }
});
exports.deleteServiceData = deleteServiceData;
const updateServiceData = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id);
    const { name, price, store_id } = request.body;
    try {
        const updatedService = yield (0, Services_1.updateService)({ name, price, store_id }, { id: id });
        return response.status(200).json(updatedService);
    }
    catch (error) {
        console.log(error);
        response.status(200).json(`failed to update the service with id${id}`);
    }
});
exports.updateServiceData = updateServiceData;
