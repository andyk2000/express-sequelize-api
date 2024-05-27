import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import { db } from "../app.config";
import { request } from "http";
import { User } from "../models/Users";
import Store from "../models/Stores";
import Service from "../models/Services";

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

sequelize.define("User", User);
sequelize.define("Store", Store);
sequelize.define("Service", Service);

app.listen(port, async () => {
  await sequelize.sync({alter: true})
  console.log("Server Listening on PORT:", port);
});