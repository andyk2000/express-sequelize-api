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
exports.serviceVerification = void 0;
const Services_1 = require("../models/Services");
const serviceVerification = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, store_id } = request.body;
    const result = yield (0, Services_1.getServiceBystoreName)({ name: name, store_id: store_id });
    if (!result) {
        next();
    }
    else {
        return response.status(500).json({ error: "the store already has that service" });
    }
});
exports.serviceVerification = serviceVerification;
