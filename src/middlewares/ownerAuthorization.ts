import { Request, Response } from "express";
import { getUserID } from "../models/Users";
import { getStoreID } from "../models/Stores";

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
    console.log(error);
    return response
      .status(500)
      .json({ error: "there was an error with this user" });
  }
};

const storeOwnerCheck = async (
  request: Request,
  response: Response,
  next: () => void,
) => {
  const ownerId = response.locals.user.id;
  const { id } = request.body;
  try {
    const store = await getStoreID(id);
    if (store) {
      if (store.userId === ownerId) {
        next();
      } else {
        return response.status(401).json({
          message: `this user: ${ownerId} is not allowed to access the data of this store: ${store.name}`,
        });
      }
    } else {
      return response.status(400).json({
        message: "the store you asked for doesn't exist",
      });
    }
  } catch (error) {
    return response
      .status(500)
      .json({ error: "there was an error with this user and the store" });
  }
};

export { ownerCheck, storeOwnerCheck };
