const jwt = require("jsonwebtoken");
import { Request, Response } from "express";
import { getUserID } from "../models/Users";

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
  
    jwt.verify(authHeader, "muu",  async (err: any, data: {email: string, id: number}) => {
        if (err) {
          return res.status(403).json({
            status: false,
            error: 'Invalid access token provided, please login again.'
          });
        }
        const user = await getUserID({id: data.id});
        res.locals = {
          user: user
        }
        console.log(res.locals);
        next();
    });
}

export default check;