import { Request, Response } from "express";
import { getPaymentByStore } from "../models/payment";
import { getStoreByOwnerForPayment } from "./StoreController";
import { getServiceCountByStoreID } from "./ServiceController";
import { getUserID } from "../models/Users";

interface Data {
  item_name: string;
  amount: number;
  customer: string;
  date: Date;
}

const findPaymentByStore = async (store_id: number) => {
  try {
    const payments = await getPaymentByStore({ store_id: store_id });
    let totalAmountPaid = 0;
    payments.map((payment) => {
      totalAmountPaid = totalAmountPaid + payment.amount;
    });
    console.log(totalAmountPaid);
    return totalAmountPaid;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findAllStorePayments = async (request: Request, response: Response) => {
  const owner_id = response.locals.user.id;
  let serviceCount = 0;
  let totalPayment = 0;
  try {
    const stores = await getStoreByOwnerForPayment(owner_id);
    await Promise.all(
      stores.map(async (store) => {
        const services = await getServiceCountByStoreID(store.id);
        serviceCount += services;
        totalPayment += await findPaymentByStore(store.id);
      }),
    );

    console.log(serviceCount);
    return response.status(200).json({
      totalPayment,
      storeCount: stores.length,
      serviceCount: serviceCount,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

const findLatestTransaction = async (request: Request, response: Response) => {
  const owner_id = response.locals.user.id;
  try {
    const stores = await getStoreByOwnerForPayment(owner_id);
    const payments: Data[] = [];

    await Promise.all(
      stores.map(async (store) => {
        const storePayments = await getPaymentByStore({ store_id: store.id });
        console.log(storePayments);
        const paymentPromises = storePayments.map(async (payt) => {
          const user = await getUserID(payt.customer_id);
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

    response.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    response
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const findServiceSold = async (request: Request, response: Response) => {
  const { store_id } = request.body;
  const all_payments: Data[] = [];
  try {
    const payments = await getPaymentByStore({ store_id: store_id });
    const paymentPromises = payments.map(async (payment) => {
      const user = await getUserID(payment.customer_id);
      if (user) {
        all_payments.push({
          item_name: payment.item_name,
          amount: payment.amount,
          customer: user.names,
          date: payment.date,
        });
      }
      console.log(all_payments);
    });
    await Promise.all(paymentPromises);
    console.log(paymentPromises);
    return response.status(200).json(all_payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    response
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const statRetrieval = async (request: Request, response: Response) => {
  const { store_id } = request.body;
  try {
    const payments = await getPaymentByStore({ store_id: store_id });

    let users: { id: number; recurrence: number; name: string }[] = [];
    let services: { name: string; recurrence: number }[] = [];

    // Process users
    for (const payment of payments) {
      const existingUser = users.find(
        (user) => user.id === payment.customer_id,
      );
      if (existingUser) {
        existingUser.recurrence++;
      } else {
        const user_name = await getUserID({ id: payment.customer_id });
        if (user_name) {
          users.push({
            id: payment.customer_id,
            recurrence: 1,
            name: user_name.names,
          });
        }
      }
    }

    // Process services
    for (const payment of payments) {
      const existingService = services.find(
        (service) => service.name === payment.item_name,
      );
      if (existingService) {
        existingService.recurrence++;
      } else {
        services.push({ name: payment.item_name, recurrence: 1 });
      }
    }

    console.log(users);
    console.log(services);

    if (users.length > 3) {
      users = users.splice(0, 2);
    }

    if (services.length > 3) {
      services = services.splice(0, 2);
    }

    response.status(200).json({ users, services });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "There was an error", error });
  }
};

export {
  findAllStorePayments,
  findLatestTransaction,
  findServiceSold,
  statRetrieval,
};
