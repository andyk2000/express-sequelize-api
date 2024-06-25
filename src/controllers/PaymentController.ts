import { Request, Response } from "express";
import {
  getAllPaymentStore,
  getPaymentDateFilter,
  getPaymentSearchByItem,
  getServiceRecurrence,
  getUserRecurrence,
  paymentByStoreOwner,
  searchPaymentByUser,
  totalPaymentByOwnedStores,
} from "../models/payment";
import { getStoreByOwnerForPayment } from "./StoreController";
import { countServiceByOwner } from "../models/Services";

const findAllStorePayments = async (request: Request, response: Response) => {
  const userId = response.locals.user.id;

  try {
    const stores = await getStoreByOwnerForPayment(userId);
    const serviceCount = await countServiceByOwner(userId);
    const totalPayment = await totalPaymentByOwnedStores(userId);

    return response.status(200).json({
      totalPayment,
      storeCount: stores.length,
      serviceCount,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllTransactions = async (request: Request, response: Response) => {
  const userId = response.locals.user.id;
  try {
    const payments = await paymentByStoreOwner(userId);
    return response.status(200).json(payments);
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

const findServiceSold = async (request: Request, response: Response) => {
  const { storeId } = request.body;
  try {
    const payments = await getAllPaymentStore(storeId);
    return response.status(200).json(payments);
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

const searchPayments = async (request: Request, response: Response) => {
  const { category, search_string, storeId } = request.body;
  let payments;
  try {
    if (category === "item") {
      payments = await getPaymentSearchByItem(search_string, storeId);
    } else if (category === "customer") {
      payments = await searchPaymentByUser(search_string, storeId);
    }
    return response.status(200).json(payments);
  } catch (error) {}
};

const filterDate = async (request: Request, response: Response) => {
  const { storeId, start_date, end_date } = request.body;
  try {
    const payments = await getPaymentDateFilter(storeId, start_date, end_date);
    return response.status(200).json(payments);
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

const statRetrieval = async (request: Request, response: Response) => {
  const { storeId } = request.body;
  try {
    const [userRecurrence, serviceRecurrence] = await Promise.all([
      getUserRecurrence(storeId),
      getServiceRecurrence(storeId),
    ]);
    const users = userRecurrence.map((record) => ({
      id: record.userId,
      recurrence: record.get("recurrence"),
      name: record.user.names,
    }));
    const services = serviceRecurrence.map((record) => ({
      name: record.item_name,
      recurrence: record.get("recurrence"),
    }));
    response.status(200).json({ users, services });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "There was an error", error });
  }
};

export {
  findAllStorePayments,
  findServiceSold,
  statRetrieval,
  searchPayments,
  filterDate,
  getAllTransactions,
};
