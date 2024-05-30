import express, { Express } from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import {initializeUser} from "../models/Users";
import {initializeStore} from "../models/Stores";
import {initializeService} from "../models/Services";
import { initializeCart } from "../models/cart";
import { getAllUsers, getUserByID, deleteUserData, updateUserData, signUp, logIn } from "../controllers/UserController";
import { createNewStore, getAllStores, getStoreByID, deleteStoreData, updateStoreData, getStoreByOwner, showAvailableShops } from "../controllers/StoreController";
import { createNewService, getAllServices, getServiceByID, deleteServiceData, updateServiceData, getStoreService } from "../controllers/ServiceController";
import { addItemToCart } from "../controllers/CartController";
import check from "../middlewares/authentication";
import ownerCheck from "../middlewares/ownerAuthorization";
import { loginValidation,signupValidation } from "../middlewares/userValidation";
import { errors } from "celebrate";
import { storeDataValidation, serviceDataValidation } from "../middlewares/dataValidation";
import { customerCheck } from "../middlewares/customerAuth";
import { initializeCartItem} from "../models/CartItem";
import { userRoutes } from "../routes/usersRoutes";
import { storeRoutes } from "../routes/storeRoutes";
import { serviceRoutes } from "../routes/serviceRoutes";
import { cartRoutes } from "../routes/cartRoutes";

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
initializeCart(sequelize);
initializeCartItem(sequelize);

//login & signup
app.post(userRoutes.signup, signUp);
app.post(userRoutes.login, loginValidation , logIn);

//get data by user id
app.get(storeRoutes.stores, [check, ownerCheck] , getStoreByOwner);
app.post(storeRoutes.stores, [check, ownerCheck, storeDataValidation] , createNewStore);
app.delete(storeRoutes.deleteStore, [check, ownerCheck] , deleteStoreData);
app.put(storeRoutes.updateStore, [check, ownerCheck] , updateStoreData);
app.post(serviceRoutes.createService, [check, ownerCheck, serviceDataValidation] , createNewService);
app.get(serviceRoutes.getServiceById, [check, ownerCheck] , getServiceByID);
app.delete(serviceRoutes.deleteService, [check, ownerCheck] , deleteServiceData);
app.put(serviceRoutes.updateService, [check, ownerCheck] , updateServiceData);

//customer access
app.get(userRoutes.home, customerCheck, showAvailableShops);
app.get(serviceRoutes.getService, getStoreService);
app.post(cartRoutes.addtoCart, addItemToCart);

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