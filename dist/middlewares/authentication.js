"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
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
    jwt.verify(authHeader, "muu", (err) => {
        if (err) {
            return res.status(403).json({
                status: false,
                error: 'Invalid access token provided, please login again.'
            });
        }
        next();
    });
};
exports.default = check;
