import express, { Express } from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import {initializeUser} from "../models/Users";
import {initializeStore} from "../models/Stores";
import {initializeService} from "../models/Services";
import { getAllUsers, getUserByID, deleteUserData, updateUserData, signUp, logIn } from "../controllers/UserController";
import { createNewStore, getAllStores, getStoreByID, deleteStoreData, updateStoreData, getStoreByOwner, showAvailableShops } from "../controllers/StoreController";
import { createNewService, getAllServices, getServiceByID, deleteServiceData, updateServiceData, getStoreService } from "../controllers/ServiceController";
import check from "../middlewares/authentication";
import ownerCheck from "../middlewares/ownerAuthorization";
import { loginValidation,signupValidation } from "../middlewares/userValidation";
import { errors } from "celebrate";
import { storeDataValidation, serviceDataValidation } from "../middlewares/dataValidation";
import { customerCheck } from "../middlewares/customerAuth";

const bodyParser = require("body-parser");
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const sequelize = new Sequelize('urubuto', 'postgres', 'Ny@bibuye30', {
  host: 'localhost',
  dialect: 'postgres'
});


initializeUser(sequelize);
initializeStore(sequelize);
initializeService(sequelize);

//login & signup
app.post("/signup", signupValidation , signUp);
app.post("/login" , loginValidation , logIn);

//crud operations for users
// app.post("/user", createNewUser);
// app.get("/user", check, getAllUsers);
// app.get("/user/:id", check, getUserByID);
// app.delete("/user/:id", check, deleteUserData);
// app.put("/user/:id", check, updateUserData);

//get data by user id
app.get("/store", [check, ownerCheck] , getStoreByOwner);
app.post("/store", [check, ownerCheck, storeDataValidation] , createNewStore);
app.delete("/store/:id", [check, ownerCheck] , deleteStoreData);
app.put("/store/:id", [check, ownerCheck] , updateStoreData);
app.post("/store/service", [check, ownerCheck, serviceDataValidation] , createNewService);
app.get("/store/service", [check, ownerCheck] , getAllServices);
app.get("/store/service/:id", [check, ownerCheck] , getServiceByID);
app.delete("/store/service/:id", [check, ownerCheck] , deleteServiceData);
app.put("/store/service/:id", [check, ownerCheck] , updateServiceData);

//customer access
app.get("/home", customerCheck, showAvailableShops);
app.post("/urubuto-store/:store_name", getStoreService);

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

app.use(errors());
app.listen(port, async () => {
  await sequelize.sync({alter: true})
  console.log("Server Listening on PORT:", port);
});