import {
  createStore,
  getStores,
  getStoreID,
  deleteStore,
  updateStore,
  getStoreOwner,
  getstoresForCustomer,
} from "../models/Stores";
import { Request, Response } from "express";
import { countPaymentsPerStore, totalPaymentByStore } from "../models/payment";
import { countServicesByStore } from "../models/Services";
import { logger } from "../../logger";
import { storeURLGenration, uploadLogoToDb } from "../helpers/StoreHelper";

const createNewStore = async (request: Request, response: Response) => {
  const { name, address, description, email, phone, logo } = request.body;
  const userId = response.locals.user.id;
  const storeUrl = storeURLGenration(name);
  if (logo) {
    const base64Data = logo.split(";base64,").pop();
    const imageBuffer = Buffer.from(base64Data, "base64");
    const logoResponse = await uploadLogoToDb(imageBuffer);
    if (logoResponse) {
      const logo2 = logoResponse;
      try {
        const data = await createStore({
          name,
          address,
          description,
          userId,
          storeUrl,
          logo: logo2,
          email,
          phone,
        });
        return response.status(201).json(data);
      } catch (error) {
        logger.error("Error creating new store");
        return response.status(500).json({ error: "Internal Server Error" });
      }
    }
  } else {
    logger.error("no logo file uploaded");
    return response.status(400).json({ error: "no file uploaded" });
  }
};

const getAllStores = async (request: Request, response: Response) => {
  try {
    const data = await getStores();
    return response.status(200).json(data);
  } catch (error) {
    logger.error("Error getting all stores", error);
    return response.status(500).json({ error: "failed to get the data" });
  }
};

const getStoreByID = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  try {
    const storeData = await getStoreID(id);
    return response.status(200).json(storeData);
  } catch (error) {
    logger.error(`Error getting store by ${id}`, error);
    return response
      .status(500)
      .json({ error: `failed to get store with id${id}` });
  }
};

const deleteStoreData = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  try {
    const deletedStore = await deleteStore(id);
    return response.status(200).json(deletedStore);
  } catch (error) {
    logger.error(`Error deleting store with id: ${id}`, error);
    response.status(500).json({ error: `failed to delete store with id${id}` });
  }
};

const updateStoreData = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  const { name, address, description, phone, email, logo, imageChange } =
    request.body;
  let logoResponse = logo;
  if (imageChange) {
    const base64Data = logo.split(";base64,").pop();
    const imageBuffer = Buffer.from(base64Data, "base64");
    logoResponse = await uploadLogoToDb(imageBuffer);
    try {
      const logo2 = logoResponse;
      const updatedStore = await updateStore(
        {
          name,
          address,
          description,
          phone,
          email,
          logo: logo2,
        },
        id,
      );
      return response.status(200).json(updatedStore);
    } catch (error) {
      logger.error(`Error updating new store: ${id}`, error);
      response
        .status(500)
        .json({ error: `failed to update the store with id${id}` });
    }
  }
  try {
    const updatedStore = await updateStore(
      {
        name,
        address,
        description,
        phone,
        email,
      },
      id,
    );
    return response.status(200).json(updatedStore);
  } catch (error) {
    logger.error(`Error updating new store: ${id}`, error);
    response
      .status(500)
      .json({ error: `failed to update the store with id${id}` });
  }
};

const getStoreByOwner = async (request: Request, response: Response) => {
  const id = response.locals.user.id;
  try {
    const storeByowner = await getStoreOwner(id);
    return response.status(200).json(storeByowner);
  } catch (error) {
    logger.error(`Error getting store by owner with: ${id}`, error);
    return response.status(500).json({ error: error });
  }
};

const showAvailableShops = async (request: Request, response: Response) => {
  try {
    const availablestores = await getstoresForCustomer();
    return response.status(200).json(availablestores);
  } catch (error) {
    logger.error("Error getting all store", error);
    return response
      .status(500)
      .json({ error: "there is a problem with the server" });
  }
};

const getStoreCardData = async (request: Request, response: Response) => {
  const { storeId } = request.body;
  try {
    let revenue = await totalPaymentByStore(storeId);
    const services = await countServicesByStore(storeId);
    const serviceSold = await countPaymentsPerStore(storeId);
    if (revenue === null) {
      revenue = 0;
    }
    return response.status(200).json({ revenue, services, serviceSold });
  } catch (error) {
    logger.error(
      `Error getting store card data for store with id: ${storeId}`,
      error,
    );
    return response.status(500).json(error);
  }
};

export {
  createNewStore,
  getAllStores,
  getStoreByID,
  deleteStoreData,
  updateStoreData,
  getStoreByOwner,
  showAvailableShops,
  getStoreCardData,
};
