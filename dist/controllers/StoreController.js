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
exports.updateStoreData = exports.deleteStoreData = exports.getStoreByID = exports.getAllStores = exports.createNewStore = void 0;
const Stores_1 = require("../models/Stores");
const createNewStore = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, description, owner_id } = request.body;
    try {
        const data = yield (0, Stores_1.createStore)({ name, address, description, owner_id });
        return response.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createNewStore = createNewStore;
const getAllStores = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, Stores_1.getStores)();
        return response.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send("faild to get the data");
    }
});
exports.getAllStores = getAllStores;
const getStoreByID = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id);
    try {
        const storeData = yield (0, Stores_1.getStoreID)({ id: id });
        return response.status(200).json(storeData);
    }
    catch (err) {
        console.log(err);
        response.status(500).send(`failed to get store with id${id}`);
    }
});
exports.getStoreByID = getStoreByID;
const deleteStoreData = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id);
    try {
        const deletedStore = yield (0, Stores_1.deleteStore)({ id: id });
        return response.status(200).json(deletedStore);
    }
    catch (error) {
        console.log(error);
        response.status(200).json(`failed to delete store with id${id}`);
    }
});
exports.deleteStoreData = deleteStoreData;
const updateStoreData = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id);
    const { names, address, description, owner_id } = request.body;
    try {
        const updatedStore = yield (0, Stores_1.updateStore)({ names, address, description, owner_id }, { id: id });
        return response.status(200).json(updatedStore);
    }
    catch (error) {
        console.log(error);
        response.status(200).json(`failed to update the store with id${id}`);
    }
});
exports.updateStoreData = updateStoreData;
