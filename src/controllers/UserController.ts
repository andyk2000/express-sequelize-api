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
import fs from "fs";
import { promisify } from "util";
import ejs from "ejs";
import path from "path";

const readFileAsync = promisify(fs.readFile);

interface Config {
  email: string;
  password: string;
  secretKey: string;
  frontendLink: string;
}

const config: Config = {
  email: process.env.EMAIL_ADDRESS || "andyirimbere@gmail.com",
  password: process.env.EMAIL_PASSWORD || "cykvvsvmijvpqxwr",
  secretKey: process.env.SECRET_KEY || "zero",
  frontendLink: process.env.FRONTEND_LINK || "http://localhost:3000",
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

const confirmationEmail = async (userEmail: string, names: string) => {
  try {
    const imageAttachment = await readFileAsync(
      path.join(__dirname, "../views/images/shopping-bag.png"),
      { encoding: "base64" },
    );

    const emailSent = await ejs.renderFile(
      path.join(__dirname, "../views/welcomeEmail.ejs"),
      {
        email: userEmail,
        user_firstname: names,
        confirm_link: config.frontendLink,
      },
    );

    const sender = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email,
        pass: config.password,
      },
      debug: true,
      logger: true,
    });

    const newMail = {
      from: config.email,
      to: userEmail,
      subject: "Welcome to our online shop",
      html: emailSent,
      attachments: [
        {
          filename: "shopping-bag.png",
          content: imageAttachment,
          encoding: "base64",
          cid: "logo",
        },
      ],
    };

    sender.sendMail(newMail, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        throw error;
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.error("Error in sending confirmation email:", error);
    throw error; // Ensure errors are propagated
  }
};

const createNewUser = async (request: Request, response: Response) => {
  const { names, email, password, role } = request.body;
  try {
    const hashedPassword = encryptPassword(password);
    const newUser = await createUser({
      names,
      email,
      password: hashedPassword,
      role,
    });
    return response.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating new user:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllUsers = async (request: Request, response: Response) => {
  try {
    const data = await getUsers();
    return response.status(200).json(data);
  } catch (error) {
    console.error("Error getting all users:", error);
    return response.status(500).json({ error: "Failed to get the data" });
  }
};

const getUserByID = async (request: Request, response: Response) => {
  const id = response.locals.user.id;
  try {
    const userData = await getUserID(id);
    return response.status(200).json(userData);
  } catch (err) {
    console.error("Error getting user by ID:", err);
    return response
      .status(500)
      .json({ error: `Failed to get user with id ${id}` });
  }
};

const deleteUserData = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  try {
    const deletedUser = await deleteUser(id);
    return response.status(200).json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    return response
      .status(500)
      .json({ error: `Failed to delete user with id ${id}` });
  }
};

const updateUserData = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  const { names, email, password, role } = request.body;
  try {
    const updatedUser = await updateUser({ names, email, password, role }, id);
    return response.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return response
      .status(500)
      .json({ error: `Failed to update user with id ${id}` });
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
    confirmationEmail(email, names);
    return response.status(200).json(newUser);
  } catch (error) {
    console.error("Error signing up user:", error);
    return response
      .status(500)
      .json({ error: "Could not create the new user" });
  }
};

const logIn = async (request: Request, response: Response) => {
  const { email, password } = request.body;
  const encrypted = encryptPassword(password);
  try {
    const user = await getUserEmail(email);
    if (!user || user.password !== encrypted) {
      return response
        .status(404)
        .json({ error: "Login failed. Please try again." });
    }
    const token = generateAccessToken(user.email, user.id);
    return response.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return response.status(500).json({ error: "Failed to login" });
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
