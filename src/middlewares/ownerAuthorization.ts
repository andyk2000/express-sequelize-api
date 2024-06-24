import { Request, Response } from "express";
import { getUserID } from "../models/Users";

const ownerCheck = async (
  request: Request,
  response: Response,
  next: () => void,
) => {
  const userId = response.locals.user.id;
  if (!userId) {
    return response.status(500).json({ error: "provide an id" });
  }

  try {
    console.log(userId);
    const owner = await getUserID(userId);
    if (!owner) {
      return response
        .status(500)
        .json({ error: `there's no user with the id ${owner}` });
    }

    if (owner.role === "owner") {
      next();
    } else {
      return response.status(401).json({
        error: "This user is not allowed to access the page required.",
      });
    }
  } catch (error) {
    console.log(userId);
    console.log(error);
    return response
      .status(500)
      .json({ error: "there was an error with this user" });
  }
};

export default ownerCheck;
