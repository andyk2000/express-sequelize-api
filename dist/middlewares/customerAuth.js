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
exports.customerCheck = void 0;
const Users_1 = require("../models/Users");
const customerCheck = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = Number(request.headers["id"]);
    if (customerId === null) {
        return response.status(500).json("provide an id");
    }
    try {
        console.log(customerId);
        const customer = yield (0, Users_1.getUserID)({ id: customerId });
        if (!customer) {
            return response.status(500).send(`there's no user with the id ${customer}`);
        }
        if (customer.role === "customer") {
            next();
        }
        else {
            return response.status(401).send("This user is not allowed to access the page required.");
        }
    }
    catch (error) {
        console.log(customerId);
        console.log(error);
        return response.status(500).send("there was an error with this user");
    }
});
exports.customerCheck = customerCheck;
