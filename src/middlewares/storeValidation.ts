import { Request, Response } from "express";
import { getStoreByName } from "../models/Stores";
import { logger } from "../../logger";

const storeVerification = async (
  request: Request,
  response: Response,
  next: () => void,
) => {
  const { name } = request.body;
  try {
    const store = await getStoreByName(name);
    if (!store) {
      next();
    } else {
      response.status(400).json({ error: "store already exist" });
    }
  } catch (error) {
    logger.error(`error checking existing store with name: ${name}`);
    throw error;
  }
};

export { storeVerification };
