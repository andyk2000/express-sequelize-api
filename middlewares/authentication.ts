const jwt = require("jsonwebtoken");
import { Request, Response } from "express";

const check = (req: Request, res: Response, next: any) => {
    const authHeader = req.headers["authorization"];
  
    if (!authHeader) {
      return res.status(401).json({
        status: false,
        error: {
          message: 'Auth headers not provided in the request.'
        }
      });
    }
  
    jwt.verify(authHeader, "muu", (err: any) => {
        if (err) {
          return res.status(403).json({
            status: false,
            error: 'Invalid access token provided, please login again.'
          });
        }
        next();
    });
}

export default check;