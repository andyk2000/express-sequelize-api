import {
  createUser,
  getUsers,
  getUserID,
  deleteUser,
  updateUser,
  getUserEmail,
} from "../models/Users";
import { Request, Response } from "express";
import Crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

interface Config {
  email: string;
  password: string;
  secretKey: string;
}

const config: Config = {
  email: process.env.EMAIL_ADDRESS || "localhost",
  password: process.env.EMAIL_PASSWORD || "",
  secretKey: process.env.SECRET_KEY || "zero",
};

const generateAccessToken = (email: string, id: number) => {
  return jwt.sign(
    {
      id,
      email,
    },
    config.secretKey,
    {
      expiresIn: 3600,
    },
  );
};

const confirmationEmail = async (email: string) => {
  const sender = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.email,
      pass: config.password,
    },
  });

  const newMail = {
    from: config.email,
    to: email,
    subject: "welcome to urubuto",
    text: "Welcome to Our Online Shopping app, the best platform to connect you with your customers and stores across Rwanda",
  };

  sender.sendMail(newMail, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

const createNewUser = async (request: Request, response: Response) => {
  const { names, email, password, role } = request.body;
  try {
    const data = await createUser({ names, email, password, role });
    console.log(data);
    return response.status(201).json(data);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllUsers = async (request: Request, response: Response) => {
  try {
    const data = await getUsers();
    return response.status(200).json(data);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "failed to get the data" });
  }
};

const getUserByID = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  try {
    const userData = await getUserID({ id: id });
    return response.status(200).json(userData);
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: `failed to get user with id${id}` });
  }
};

const deleteUserData = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  try {
    const deletedUser = await deleteUser({ id: id });
    return response.status(200).json(deletedUser);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: `failed to delete user with id${id}` });
  }
};

const updateUserData = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  const { names, email, password, role } = request.body;
  try {
    const updatedUser = await updateUser(
      { names, email, password, role },
      { id: id },
    );
    return response.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ error: `failed to update the user with id${id}` });
  }
};

const encryptPassword = (password: string) => {
  const hash = Crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
};

const signUp = async (request: Request, response: Response) => {
  let { password } = request.body;
  const { names, email, role } = request.body;
  password = encryptPassword(password);
  try {
    const newUser = await createUser({ names, email, password, role });
    confirmationEmail(email);
    return response.status(200).json(newUser);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "could not creat the new user" });
  }
};

const logIn = async (request: Request, response: Response) => {
  const { email, password } = request.body;
  const encrypted = encryptPassword(password);
  try {
    const user = await getUserEmail({ email: email });
    if (user === null) {
      return response.status(404).json({ error: "login failed try again" });
    }
    if (user.password !== encrypted) {
      return response.status(404).json({ error: "login failed try again" });
    }
    const token = generateAccessToken(user.email, user.id);

    return response.status(200).json({ token: token });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "failed to login" });
  }
};

export {
  createNewUser,
  getAllUsers,
  getUserByID,
  deleteUserData,
  updateUserData,
  signUp,
  logIn,
};
