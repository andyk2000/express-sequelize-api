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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const Users_1 = require("../models/Users");
const UserController_1 = require("../controllers/UserController");
const StoreController_1 = require("../controllers/StoreController");
const Stores_1 = require("../models/Stores");
// import Service from "../models/Services";
const bodyParser = require("body-parser");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
const sequelize = new sequelize_1.Sequelize('urubuto', 'postgres', 'Ny@bibuye30', {
    host: 'localhost',
    dialect: 'postgres'
});
(0, Users_1.initializeUser)(sequelize);
(0, Stores_1.initializeStore)(sequelize);
// sequelize.define("Service", Service);
//crud operations for users
app.post("/user", UserController_1.createNewUser);
app.get("/user", UserController_1.getAllUsers);
app.get("/user/:id", UserController_1.getUserByID);
app.delete("/user/:id", UserController_1.deleteUserData);
app.put("/user/:id", UserController_1.updateUserData);
//crud operations for user
app.post("/store", StoreController_1.createNewStore);
app.get("/store", StoreController_1.getAllStores);
app.get("/store/:id", StoreController_1.getStoreByID);
app.delete("/store/:id", StoreController_1.deleteStoreData);
app.put("/store/:id", StoreController_1.updateStoreData);
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.sync({ alter: true });
    console.log("Server Listening on PORT:", port);
}));
