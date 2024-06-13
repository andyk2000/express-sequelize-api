import { Request, Response } from "express";
import { getUserEmail, getUserID } from "../models/Users";

const customerCheck = async (
  request: Request,
  response: Response,
  next: () => void,
) => {
  const customerId = response.locals.user.id;
  console.log(customerId);
  if (customerId === null) {
    return response.status(500).json({ error: "provide an id" });
  }

  try {
    console.log(customerId);
    const customer = await getUserID({ id: customerId });
    if (!customer) {
      return response
        .status(500)
        .json({ error: `there's no user with the id ${customer}` });
    }

    if (customer.role === "customer") {
      next();
    } else {
      return response.status(401).json({
        error: "This user is not allowed to access the page required.",
      });
    }
  } catch (error) {
    console.log(customerId);
    console.log(error);
    return response
      .status(500)
      .json({ error: "there was an error with this user" });
  }
};

const emailVerification = async (
  request: Request,
  response: Response,
  next: () => void,
) => {
  const { email } = request.body;
  try {
    const user = await getUserEmail({ email: email });
    if (!user) {
      next();
    } else {
      response.status(400).json({ error: "email already in use" });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { customerCheck, emailVerification };
