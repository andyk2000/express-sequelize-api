import express, { Express } from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import {initialize} from "../models/Users";
import { createNewUser, getAllUsers, getUserByID, deleteUserData, updateUserData } from "../controllers/UserController";
// import Store from "../models/Stores";
// import Service from "../models/Services";

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

initialize(sequelize);
// sequelize.define("Store", Store);
// sequelize.define("Service", Service);

app.post("/", createNewUser);
app.get("/", getAllUsers);
app.get("/:id", getUserByID);
app.delete("/:id", deleteUserData);
app.put("/:id", updateUserData);

app.listen(port, async () => {
  await sequelize.sync({alter: true})
  console.log("Server Listening on PORT:", port);
});