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
import { getPaymentByStore } from "../models/payment";
import { getServiceByStoreID } from "../models/Services";

const storeURLGenration = (name: string) => {
  const store_name = slugify(name, { lower: true, strict: true });
  return `${store_name}&123456789`;
};

const createNewStore = async (request: Request, response: Response) => {
  const { name, address, description } = request.body;
  console.log(response.locals.user.id);
  const owner_id = response.locals.user.id;
  const storeUrl = storeURLGenration(name);
  try {
    const data = await createStore({
      name,
      address,
      description,
      owner_id,
      storeUrl,
    });
    return response.status(201).json(data);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllStores = async (request: Request, response: Response) => {
  try {
    const data = await getStores();
    return response.status(200).json(data);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "faild to get the data" });
  }
};

const getStoreByID = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  try {
    const storeData = await getStoreID({ id: id });
    return response.status(200).json(storeData);
  } catch (err) {
    console.log(err);
    return response
      .status(500)
      .json({ error: `failed to get store with id${id}` });
  }
};

const deleteStoreData = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  try {
    const deletedStore = await deleteStore({ id: id });
    return response.status(200).json(deletedStore);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: `failed to delete store with id${id}` });
  }
};

const updateStoreData = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  const { names, address, description } = request.body;
  try {
    const updatedStore = await updateStore(
      { names, address, description },
      { id: id },
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
    const storeByowner = await getStoreOwner({ owner_id: id });
    return response.status(200).json(storeByowner);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: error });
  }
};

const getStoreByOwnerForPayment = async (owner_id: number) => {
  const id = owner_id;
  try {
    const storeByowner = await getStoreOwner({ owner_id: id });
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
  const { store_id } = request.body;
  let revenue = 0;
  try {
    const payments = await getPaymentByStore({ store_id: store_id });
    const services = await getServiceByStoreID({ store_id: store_id });
    const serviceSold = payments.length;
    const availableServices = services.length;
    console.log(services.length);
    payments.map((payment) => {
      revenue = revenue + payment.amount;
      console.log(revenue);
    });
    console.log(revenue);
    return response
      .status(200)
      .json({ revenue, availableServices, serviceSold });
  } catch (error) {}
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
