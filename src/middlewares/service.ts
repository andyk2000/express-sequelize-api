import { Request, Response } from "express";
import { getServiceBystoreName } from "../models/Services";
import { logger } from "../../logger";

const serviceVerification = async (
  request: Request,
  response: Response,
  next: () => void,
) => {
  const { name, storeId } = request.body;

  try {
    const result = await getServiceBystoreName({
      name: name,
      storeId: storeId,
    });
    if (!result) {
      next();
    } else {
      return response
        .status(500)
        .json({ error: "the store already has that service" });
    }
  } catch (error) {
    logger.error(
      `Error checking if store with Id: ${storeId} has service with name: ${name}`,
    );
  }
};

export { serviceVerification };
