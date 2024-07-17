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
import slugify from "slugify";
import { countPaymentsPerStore, totalPaymentByStore } from "../models/payment";
import { countServicesByStore } from "../models/Services";
import { UploadApiResponse, v2 as cloudinary } from "cloudinary";

interface Config {
  api_secret: string;
  cloud_name: string;
  api_key: string;
}

const config: Config = {
  api_secret: process.env.CLOUDINARY_SECRET_KEY || "",
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
};

const frontend_link = process.env.FRONTEND_LINK || "";

const storeURLGenration = (name: string) => {
  const store_name = slugify(name, { lower: true, strict: true });
  return `${frontend_link}${store_name}&123456789`;
};

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
        console.error(error);
        return response.status(500).json({ error: "Internal Server Error" });
      }
    }
  } else {
    return response.status(400).json({ error: "no file uploaded" });
  }
};

const getAllStores = async (request: Request, response: Response) => {
  try {
    const data = await getStores();
    return response.status(200).json(data);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "failed to get the data" });
  }
};

const getStoreByID = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  try {
    const storeData = await getStoreID(id);
    return response.status(200).json(storeData);
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
      console.log(error);
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
    console.log(error);
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
    console.log(error);
    return response.status(500).json({ error: error });
  }
};

const getStoreByOwnerForPayment = async (userId: number) => {
  const id = userId;
  try {
    const storeByowner = await getStoreOwner(id);
    return storeByowner;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const showAvailableShops = async (request: Request, response: Response) => {
  try {
    const availablestores = await getstoresForCustomer();
    return response.status(200).json(availablestores);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ error: "there is a problem with the server" });
  }
};

const getStoreCardData = async (request: Request, response: Response) => {
  const { storeId } = request.body;
  try {
    const revenue = await totalPaymentByStore(storeId);
    const services = await countServicesByStore(storeId);
    const serviceSold = await countPaymentsPerStore(storeId);
    return response.status(200).json({ revenue, services, serviceSold });
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

const uploadLogoToDb = async (uploadFile: Buffer) => {
  cloudinary.config(config);
  const uploadResult: UploadApiResponse = await new Promise((resolve) => {
    cloudinary.uploader
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .upload_stream((error, uploadResult) => {
        if (uploadResult !== undefined) {
          return resolve(uploadResult);
        }
      })
      .end(uploadFile);
  });
  return uploadResult.secure_url;
};

export {
  createNewStore,
  getAllStores,
  getStoreByID,
  deleteStoreData,
  updateStoreData,
  getStoreByOwner,
  showAvailableShops,
  getStoreByOwnerForPayment,
  getStoreCardData,
};
