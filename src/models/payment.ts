import { DataTypes, Sequelize, Model, Optional, Op } from "sequelize";
// import { Store } from "./Stores";
import { User } from "./Users";
import { Store } from "./Stores";

interface PaymentAttributes {
  id: number;
  item_name: string;
  storeId: number;
  userId: number;
  amount: number;
  date: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, "id"> {}

class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  public id!: number;
  public item_name!: string;
  public storeId!: number;
  public userId!: number;
  public amount!: number;
  public date!: Date;
}

const paymentSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "stores",
      key: "id",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
};

const initializePayment = (sequelize: Sequelize) => {
  Payment.init(paymentSchema, {
    sequelize,
    modelName: "payments",
    timestamps: false,
  });
};

const getPayments = async () => {
  const paymentsData = await Payment.findAll();
  return paymentsData;
};

const createPayment = async (store: PaymentCreationAttributes) => {
  return await Payment.create(store);
};

const getPaymentID = async (paymentId: number) => {
  const paymentData = await Payment.findOne({
    where: {
      id: paymentId,
    },
  });
  return paymentData;
};

const deletePayment = async (id: number) => {
  return await Payment.destroy({
    where: {
      id: id,
    },
  });
};

const updatePayment = async (data: NonNullable<unknown>, id: number) => {
  return await Payment.update(data, {
    where: {
      id: id,
    },
  });
};

const getPaymentSearchByItem = async (
  search_string: string,
  storeId: number,
) => {
  const payments = await Payment.findAll({
    where: {
      storeId: storeId,
      item_name: {
        [Op.like]: `%${search_string}%`,
      },
    },
    include: { model: User, attributes: ["names", "email"] },
  });

  return payments;
};

const searchPaymentByUser = async (search_string: string, storeId: string) => {
  return await Payment.findAll({
    where: {
      storeId: storeId,
    },
    include: {
      model: User,
      attributes: ["names", "email"],
      where: {
        names: {
          [Op.like]: `%${search_string}%`,
        },
      },
    },
  });
};

const getAllPaymentStore = async (storeID: number) => {
  return await Payment.findAll({
    where: {
      storeId: storeID,
    },
    include: { model: User, attributes: ["names", "email"] },
  });
};

const getPaymentDateFilter = async (
  storeId: number,
  startDate: Date,
  endDate: Date,
) => {
  if (startDate && endDate) {
    return await Payment.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
        storeId: storeId,
      },
      include: {
        model: User,
        attributes: ["names", "email"],
      },
    });
  } else if (!startDate && endDate) {
    return await Payment.findAll({
      where: {
        date: {
          [Op.lt]: endDate,
        },
        storeId: storeId,
      },
      include: {
        model: User,
        attributes: ["names", "email"],
      },
    });
  } else if (startDate && !endDate) {
    return await Payment.findAll({
      where: {
        date: {
          [Op.gte]: startDate,
        },
        storeId: storeId,
      },
      include: {
        model: User,
        attributes: ["names", "email"],
      },
    });
  } else {
    return await Payment.findAll({
      where: {
        storeId: storeId,
      },
      include: {
        model: User,
        attributes: ["names", "email"],
      },
    });
  }
};

const countPaymentsPerStore = async (storeId: number) => {
  return await Payment.count({
    where: {
      storeId: storeId,
    },
  });
};

const totalPaymentByStore = async (storeId: number) => {
  return await Payment.sum("amount", {
    where: {
      storeId: storeId,
    },
  });
};

const paymentByStoreOwner = async (userId: number) => {
  return await Payment.findAll({
    include: [
      {
        model: Store,
        where: {
          userId: userId,
        },
      },
      {
        model: User,
        attributes: ["names", "email"],
      },
    ],
  });
};

const totalPaymentByOwnedStores = async (userId: number) => {
  const stores = await Store.findAll({
    where: {
      userId: userId,
    },
    attributes: ["id"],
  });

  const storeIds = stores.map((store) => store.id);

  if (storeIds.length === 0) {
    return 0;
  }
  const totalAmount = await Payment.sum("amount", {
    where: {
      storeId: {
        [Op.in]: storeIds,
      },
    },
  });
  return totalAmount;
};

const getUserRecurrence = async (storeId: number) => {
  try {
    const payments = await Payment.findAll({
      attributes: [
        "userId",
        [Sequelize.fn("COUNT", Sequelize.col("userId")), "recurrence"],
      ],
      where: { storeId: storeId },
      include: {
        model: User,
        as: "user",
        attributes: ["id", "names"],
      },
      group: ["userId", "user.id"],
      order: [[Sequelize.literal("recurrence"), "DESC"]],
      limit: 3,
    });

    return payments;
  } catch (error) {
    console.error("Error in getUserRecurrence:", error);
    throw error;
  }
};

const getServiceRecurrence = async (storeId: number) => {
  return await Payment.findAll({
    attributes: [
      "item_name",
      [Sequelize.fn("COUNT", Sequelize.col("item_name")), "recurrence"],
    ],
    where: { storeId: storeId },
    group: ["item_name"],
    order: [[Sequelize.literal("recurrence"), "DESC"]],
    limit: 3,
  });
};

export {
  initializePayment,
  getPayments,
  updatePayment,
  deletePayment,
  getPaymentID,
  createPayment,
  Payment,
  getPaymentSearchByItem,
  getAllPaymentStore,
  searchPaymentByUser,
  getPaymentDateFilter,
  countPaymentsPerStore,
  totalPaymentByStore,
  paymentByStoreOwner,
  totalPaymentByOwnedStores,
  getUserRecurrence,
  getServiceRecurrence,
};
