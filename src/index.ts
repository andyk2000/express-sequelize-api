import express, { Express } from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import {initializeUser} from "../models/Users";
import {initializeStore} from "../models/Stores";
import {initializeService} from "../models/Services";
import { createNewUser, getAllUsers, getUserByID, deleteUserData, updateUserData } from "../controllers/UserController";
import { createNewStore, getAllStores, getStoreByID, deleteStoreData, updateStoreData } from "../controllers/StoreController";
import { createNewService, getAllServices, getServiceByID, deleteServiceData, updateServiceData } from "../controllers/ServiceController";

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

//crud operations for users
app.post("/user", createNewUser);
app.get("/user", getAllUsers);
app.get("/user/:id", getUserByID);
app.delete("/user/:id", deleteUserData);
app.put("/user/:id", updateUserData);

//crud operations for stores
app.post("/store", createNewStore);
app.get("/store", getAllStores);
app.get("/store/:id", getStoreByID);
app.delete("/store/:id", deleteStoreData);
app.put("/store/:id", updateStoreData);

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