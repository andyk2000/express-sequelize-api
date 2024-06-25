import { Request, Response } from "express";
import { getStoreByName } from "../models/Stores";

const storeVerification = async (
  request: Request,
  response: Response,
  next: () => void,
) => {
  const { name } = request.body;
  try {
    const store = await getStoreByName(name);
    console.log(name);
    if (!store) {
      next();
    } else {
      response.status(400).json({ error: "store already exist" });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { storeVerification };
