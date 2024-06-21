import { DataTypes, Sequelize, Model, Optional } from "sequelize";
import { Store } from "./Stores";

interface ServiceAttributes {
  id: number;
  name: string;
  price: number;
  storeId: number;
}

interface ServiceCreationAttributes extends Optional<ServiceAttributes, "id"> {}

class Service
  extends Model<ServiceAttributes, ServiceCreationAttributes>
  implements ServiceAttributes
{
  public id!: number;
  public name!: string;
  public price!: number;
  public storeId!: number;
}

const serviceSchema = {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  storeId: {
    type: DataTypes.INTEGER,
    AllowNull: false,
    references: {
      model: "stores",
      key: "id",
    },
  },
};

const initializeService = (sequelize: Sequelize) => {
  Service.init(serviceSchema, {
    sequelize,
    modelName: "service",
    timestamps: false,
  });
};

const getServices = async () => {
  const storesData = await Service.findAll();
  return storesData;
};

const createService = async (service: ServiceCreationAttributes) => {
  return await Service.create(service);
};

const getServiceID = async (query: NonNullable<unknown>) => {
  const serviceData = await Service.findOne({
    where: query,
  });
  return serviceData;
};

const deleteService = async (query: NonNullable<unknown>) => {
  return await Service.destroy({
    where: query,
  });
};

const updateService = async (
  data: NonNullable<unknown>,
  query: NonNullable<unknown>,
) => {
  return await Service.update(data, {
    where: query,
  });
};

const getServicesByStore = async (query: NonNullable<unknown>) => {
  return await Service.findAll({
    where: query,
  });
};

const getServiceBystoreName = async (query: NonNullable<unknown>) => {
  return await Service.findOne({
    where: query,
  });
};

const getServiceByStoreID = async (id: number) => {
  return await Service.findAll({
    where: {
      storeId: id,
    },
  });
};

const countServicesByStore = async (storeId: number) => {
  return await Service.count({
    where: {
      storeId: storeId,
    },
  });
};

const countServiceByOwner = async (userId: number) => {
  return await Service.count({
    include: {
      model: Store,
      where: {
        userId: userId,
      },
    },
  });
};

export {
  initializeService,
  getServices,
  getServiceID,
  createService,
  deleteService,
  updateService,
  getServicesByStore,
  getServiceBystoreName,
  getServiceByStoreID,
  Service,
  countServicesByStore,
  countServiceByOwner,
};
