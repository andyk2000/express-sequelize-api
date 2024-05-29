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
const Stores_1 = require("../models/Stores");
const Services_1 = require("../models/Services");
const UserController_1 = require("../controllers/UserController");
const StoreController_1 = require("../controllers/StoreController");
const ServiceController_1 = require("../controllers/ServiceController");
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const ownerAuthorization_1 = __importDefault(require("../middlewares/ownerAuthorization"));
const userValidation_1 = require("../middlewares/userValidation");
const celebrate_1 = require("celebrate");
const dataValidation_1 = require("../middlewares/dataValidation");
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
(0, Services_1.initializeService)(sequelize);
//login & signup
app.post("/signup", userValidation_1.signupValidation, UserController_1.signUp);
app.post("/login", userValidation_1.loginValidation, UserController_1.logIn);
//crud operations for users
// app.post("/user", createNewUser);
// app.get("/user", check, getAllUsers);
// app.get("/user/:id", check, getUserByID);
// app.delete("/user/:id", check, deleteUserData);
// app.put("/user/:id", check, updateUserData);
//get data by user id
app.get("/store", [authentication_1.default, ownerAuthorization_1.default], StoreController_1.getStoreByOwner);
app.post("/store", [authentication_1.default, ownerAuthorization_1.default, dataValidation_1.storeDataValidation], StoreController_1.createNewStore);
app.delete("/store/:id", [authentication_1.default, ownerAuthorization_1.default], StoreController_1.deleteStoreData);
app.put("/store/:id", [authentication_1.default, ownerAuthorization_1.default], StoreController_1.updateStoreData);
app.post("/store/service", [authentication_1.default, ownerAuthorization_1.default, dataValidation_1.serviceDataValidation], ServiceController_1.createNewService);
app.get("/store/service", [authentication_1.default, ownerAuthorization_1.default], ServiceController_1.getAllServices);
app.get("/store/service/:id", [authentication_1.default, ownerAuthorization_1.default], ServiceController_1.getServiceByID);
app.delete("/store/service/:id", [authentication_1.default, ownerAuthorization_1.default], ServiceController_1.deleteServiceData);
app.put("/store/service/:id", [authentication_1.default, ownerAuthorization_1.default], ServiceController_1.updateServiceData);
//customer access
//crud operations for stores
// app.post("/store", createNewStore);
// app.get("/store", getAllStores);
// app.get("/store/:id", getStoreByID);
// app.delete("/store/:id", deleteStoreData);
// app.put("/store/:id", updateStoreData);
//crud operations for services
// app.post("/service", createNewService);
// app.get("/service", getAllServices);
// app.get("/service/:id", getServiceByID);
// app.delete("/service/:id", deleteServiceData);
// app.put("/service/:id", updateServiceData);
app.use((0, celebrate_1.errors)());
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.sync({ alter: true });
    console.log("Server Listening on PORT:", port);
}));
