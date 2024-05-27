"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const db = new pg_1.Pool({
    user: "postgres",
    host: 'localhost',
    database: "merchant-service",
    password: "Ny@bibuye30",
    port: 5432
});
exports.db = db;
