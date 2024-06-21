import { Request, Response } from "express";
import {
  getAllPaymentStore,
  getPaymentByStore,
  getPaymentDateFilter,
  getPaymentSearchByItem,
  getServiceRecurrence,
  getUserRecurrence,
  paymentByStoreOwner,
  searchPaymentByUser,
  totalPaymentByOwnedStores,
} from "../models/payment";
import { getStoreByOwnerForPayment } from "./StoreController";
import { getUserID } from "../models/Users";
import { countServiceByOwner } from "../models/Services";

interface Data {
  item_name: string;
  amount: number;
  customer: string;
  date: Date;
}

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

const findLatestTransaction = async (request: Request, response: Response) => {
  const userId = response.locals.user.id;
  try {
    const stores = await getStoreByOwnerForPayment(userId);
    const payments: Data[] = [];

    await Promise.all(
      stores.map(async (store) => {
        const storePayments = await getPaymentByStore({ storeId: store.id });
        const paymentPromises = storePayments.map(async (payt) => {
          const user = await getUserID(payt.userId);
          if (user) {
            payments.push({
              item_name: payt.item_name,
              amount: payt.amount,
              customer: user.names,
              date: payt.date,
            });
          }
        });
        await Promise.all(paymentPromises);
      }),
    );

    const sortedPayments = payments.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    response.status(200).json(sortedPayments.splice(0, 6));
  } catch (error) {
    console.error("Error fetching payments:", error);
    response
      .status(500)
      .json({ success: false, message: "Something went wrong" });
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

const findServiceFilterByDate = async (
  request: Request,
  response: Response,
) => {
  const { storeId, start_date, end_date } = request.body;
  const all_payments: Data[] = [];

  try {
    const payments = await getPaymentByStore({ storeId: storeId });

    const paymentPromises = payments.map(async (payment) => {
      const paymentDate = payment.date.toISOString().substr(0, 10);
      const startDate = start_date ? new Date(start_date) : null;
      const endDate = end_date ? new Date(end_date) : null;

      if (startDate && endDate && startDate.getTime() === endDate.getTime()) {
        if (paymentDate === start_date) {
          const user = await getUserID(payment.userId);
          if (user) {
            all_payments.push({
              item_name: payment.item_name,
              amount: payment.amount,
              customer: user.names,
              date: payment.date,
            });
          }
        }
      } else {
        const paymentDateObj = new Date(payment.date);
        const withinRange =
          (!startDate || paymentDateObj >= startDate) &&
          (!endDate || paymentDateObj <= endDate);

        if (withinRange) {
          const user = await getUserID(payment.userId);
          if (user) {
            all_payments.push({
              item_name: payment.item_name,
              amount: payment.amount,
              customer: user.names,
              date: payment.date,
            });
          }
        }
      }
    });

    await Promise.all(paymentPromises);

    const sortedPayments = all_payments.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    return response.status(200).json(sortedPayments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return response
      .status(500)
      .json({ success: false, message: "Something went wrong" });
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
    let users = userRecurrence.map((record) => ({
      id: record.userId,
      recurrence: record.get("recurrence"),
      name: record.user.names,
    }));
    let services = serviceRecurrence.map((record) => ({
      name: record.item_name,
      recurrence: record.get("recurrence"),
    }));
    users = users.sort((a, b) => b.recurrence - a.recurrence).slice(0, 3);
    services = services.sort((a, b) => b.recurrence - a.recurrence).slice(0, 3);

    response.status(200).json({ users, services });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "There was an error", error });
  }
};

export {
  findServiceFilterByDate,
  findAllStorePayments,
  findLatestTransaction,
  findServiceSold,
  statRetrieval,
  searchPayments,
  filterDate,
  getAllTransactions,
  // getAllpayment,
};
