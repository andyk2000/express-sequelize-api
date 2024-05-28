import express, { Express } from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import {createUser, initializeUser} from "../models/Users";
import {initializeStore} from "../models/Stores";
import {initializeService} from "../models/Services";
import { getAllUsers, getUserByID, deleteUserData, updateUserData, signUp, logIn } from "../controllers/UserController";
import { createNewStore, getAllStores, getStoreByID, deleteStoreData, updateStoreData, getStoreByOwner } from "../controllers/StoreController";
import { createNewService, getAllServices, getServiceByID, deleteServiceData, updateServiceData } from "../controllers/ServiceController";
import check from "../middlewares/authentication";
import ownerCheck from "../middlewares/ownerAuthorization";

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
app.post("/signup", signUp);
app.get("/login", logIn);

//crud operations for users
// app.post("/user", createNewUser);
// app.get("/user", check, getAllUsers);
// app.get("/user/:id", check, getUserByID);
// app.delete("/user/:id", check, deleteUserData);
// app.put("/user/:id", check, updateUserData);

//get data by id
app.get("/store", [check, ownerCheck] , getStoreByOwner);
app.post("/store", [check, ownerCheck] , createNewStore);

//crud operations for stores
// app.post("/store", createNewStore);
// app.get("/store", getAllStores);
// app.get("/store/:id", getStoreByID);
// app.delete("/store/:id", deleteStoreData);
// app.put("/store/:id", updateStoreData);

//crud operations for services
app.post("/service", createNewService);
app.get("/service", getAllServices);
app.get("/service/:id", getServiceByID);
app.delete("/service/:id", deleteServiceData);
app.put("/service/:id", updateServiceData);

app.listen(port, async () => {
  await sequelize.sync({alter: true})
  console.log("Server Listening on PORT:", port);
});