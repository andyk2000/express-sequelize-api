import {
  createService,
  getServices,
  getServiceID,
  deleteService,
  updateService,
  getServicesByStore,
} from "../models/Services";
import { getStoreByUrl } from "../models/Stores";
import { Request, Response } from "express";

const createNewService = async (request: Request, response: Response) => {
  const { name, price, store_id } = request.body;
  try {
    const data = await createService({ name, price, store_id });
    return response.status(201).json(data);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllServices = async (request: Request, response: Response) => {
  try {
    const data = await getServices();
    return response.status(200).json(data);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "faild to get the data" });
  }
};

const getServiceByID = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  try {
    const storeData = await getServiceID({ id: id });
    return response.status(200).json(storeData);
  } catch (err) {
    console.log(err);
    response.status(500).json({ error: `failed to get service with id${id}` });
  }
};

const deleteServiceData = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  try {
    const deletedService = await deleteService({ id: id });
    return response.status(200).json(deletedService);
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ error: `failed to delete service with id${id}` });
  }
};

const updateServiceData = async (request: Request, response: Response) => {
  const id = parseInt(request.params.id);
  const { name, price, store_id } = request.body;
  try {
    const updatedService = await updateService(
      { name, price, store_id },
      { id: id },
    );
    return response.status(200).json(updatedService);
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ error: `failed to update the service with id${id}` });
  }
};

const getStoreService = async (request: Request, response: Response) => {
  const url = request.params.storeurl;

  try {
    const store_id = await await getStoreByUrl({ storeUrl: url });
    if (!store_id) {
      return response.status(500).json({ error: "store not found" });
    }
    const services = await getServicesByStore({
      store_id: store_id.toString(),
    });
    return response.status(200).json(services);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ error: "failed to load the store requested" });
  }
};

export {
  createNewService,
  getAllServices,
  getServiceByID,
  deleteServiceData,
  updateServiceData,
  getStoreService,
};
