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
const Users_1 = require("../models/Users");
const ownerCheck = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ownerId = response.locals.user.id;
    console.log(response.locals.user.id);
    if (!ownerId) {
        return response.status(500).json({ error: "provide an id" });
    }
    try {
        const owner = yield (0, Users_1.getUserID)({ id: ownerId });
        if (!owner) {
            return response.status(500).json({ error: `there's no user with the id ${owner}` });
        }
        if (owner.role === "owner") {
            next();
        }
        else {
            return response.status(401).json({ error: "This user is not allowed to access the page required." });
        }
    }
    catch (error) {
        console.log(ownerId);
        console.log(error);
        return response.status(500).json({ error: "there was an error with this user" });
    }
});
exports.default = ownerCheck;
