import slugify from "slugify";
import { getStoreOwner } from "../models/Stores";
import { logger } from "../../logger";
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

const getStoreByOwnerForPayment = async (userId: number) => {
  const id = userId;
  try {
    const storeByowner = await getStoreOwner(id);
    return storeByowner;
  } catch (error) {
    logger.error(
      `Error getting store and payment information by owner with: ${id}`,
      error,
    );
    throw error;
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
  uploadLogoToDb,
  getStoreByOwnerForPayment,
  getStoreOwner,
  storeURLGenration,
};
