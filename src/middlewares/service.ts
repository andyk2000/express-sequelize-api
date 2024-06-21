import { Request, Response } from "express";
import { getServiceBystoreName } from "../models/Services";

const serviceVerification = async (
  request: Request,
  response: Response,
  next: () => void,
) => {
  const { name, storeId } = request.body;

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
};

export { serviceVerification };
