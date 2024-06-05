import { Request, Response } from "express";
import { getServiceBystoreName } from "../models/Services";

const serviceVerification = async (
  request: Request,
  response: Response,
  next: any,
) => {
  const { name, store_id } = request.body;

  const result = await getServiceBystoreName({
    name: name,
    store_id: store_id,
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
