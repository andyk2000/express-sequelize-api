import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

interface ServiceAttributes {
    id: number;
    name: string;
    price: number;
    store_id: string;
}

interface ServiceCreationAttributes extends Optional<ServiceAttributes, 'id'> {}

class Service extends Model<ServiceAttributes, ServiceCreationAttributes> implements ServiceAttributes {
    public id!: number;
    public name!: string;
    public price!: number;
    public store_id!: string;
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
    store_id: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}

const initializeService = (sequelize: Sequelize) => {
    Service.init(serviceSchema, {
        sequelize,
        modelName: 'service',
        timestamps: false,
    });
};

const getServices = async () => {
    const storesData = await Service.findAll();
    return storesData;
}

const createService = async (service: ServiceCreationAttributes) => {
    return await Service.create(service);
};

const getServiceID = async (query: {}) => {
    const serviceData = await Service.findOne({
        where: query
    });
    return serviceData;
}

const deleteService = async (query: {}) => {
    return await Service.destroy({
        where: query
    })
}

const updateService = async (data: {}, query: {}) => {
    return await Service.update(data, {
        where: query
    })
}

const getServicesByStore = async (query: {}) => {
    return await Service.findAll({
        where: query
    })
}

const getServiceBystoreName = async (query: {}) =>{
    return await Service.findOne({
        where: query
    })
}

export {
    initializeService,
    getServices,
    getServiceID,
    createService,
    deleteService,
    updateService,
    getServicesByStore,
    getServiceBystoreName,
};