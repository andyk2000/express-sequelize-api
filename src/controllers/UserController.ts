import {
  createUser,
  getUsers,
  getUserID,
  deleteUser,
  updateUser,
  getUserEmail,
} from "../models/Users";
import { Request, Response } from "express";
import { logger } from "../../logger";
import {
  confirmationEmail,
  encryptPassword,
  generateAccessToken,
} from "../helpers/UserHelper";

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
    logger.error("Error creating user", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllUsers = async (request: Request, response: Response) => {
  try {
    const data = await getUsers();
    return response.status(200).json(data);
  } catch (error) {
    logger.error("Error getting all users", error);
    return response.status(500).json({ error: "Failed to get the data" });
  }
};

const getUserByID = async (request: Request, response: Response) => {
  const id = response.locals.user.id;
  try {
    const userData = await getUserID(id);
    return response.status(200).json(userData);
  } catch (error) {
    logger.error("Error getting user by ID", error);
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
    logger.error("Error deleting user", error);
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
    logger.error("Error updating user", error);
    return response
      .status(500)
      .json({ error: `Failed to update user with id ${id}` });
  }
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
    logger.error("Error signing up user", error);
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
    if (user.role === "customer") {
      const token = generateAccessToken(user.email, user.id);
      return response.status(200).json({ token, role: "customer" });
    } else if (user.role === "owner") {
      const token = generateAccessToken(user.email, user.id);
      return response.status(200).json({ token, role: "owner" });
    }
  } catch (error) {
    logger.error("Error loggingin", error);
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
