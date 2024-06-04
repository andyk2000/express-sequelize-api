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
const jwt = require("jsonwebtoken");
const Users_1 = require("../models/Users");
const check = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({
            status: false,
            error: {
                message: 'Auth headers not provided in the request.'
            }
        });
    }
    jwt.verify(authHeader, "muu", (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(403).json({
                status: false,
                error: 'Invalid access token provided, please login again.'
            });
        }
        const user = yield (0, Users_1.getUserID)({ id: data.id });
        res.locals = {
            user: user
        };
        console.log(res.locals);
        next();
    }));
};
exports.default = check;
