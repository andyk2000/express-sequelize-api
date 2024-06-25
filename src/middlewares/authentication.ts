import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { getUserID } from "../models/Users";

const secretKey = process.env.SECRET_KEY || "zero";

const check = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      status: false,
      error: {
        message: "Auth headers not provided in the request.",
      },
    });
  }

  jwt.verify(authHeader, secretKey, async (err, data) => {
    if (err || !data || typeof data === "string") {
      return res.status(403).json({
        status: false,
        error: "Invalid access token provided, please login again.",
      });
    }
    const user = await getUserID(data.id);
    res.locals = {
      user: user,
    };
    next();
  });
};

export default check;
