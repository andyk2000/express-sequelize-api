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
exports.storeVerification = void 0;
const Stores_1 = require("../models/Stores");
const storeVerification = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = request.body;
    try {
        const store = yield (0, Stores_1.getStoreByName)({ name: name });
        console.log(name);
        if (!store) {
            next();
        }
        else {
            response.status(400).json({ error: "store already exist", });
        }
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.storeVerification = storeVerification;
