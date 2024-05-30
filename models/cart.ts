import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

// Define the attributes for the User model
interface CartAttributes {
    id: number;
    customer_id: string;
    items: object;
    total_price: number;
}

interface Item {
    name: string;
}

// Define the attributes for creating a User (id is optional)
interface CartCreationAttributes extends Optional<CartAttributes, 'id'> {}

// Define the User model class
class Cart extends Model<CartAttributes, CartCreationAttributes> implements CartAttributes {
    public id!: number;
    public customer_id!: string;
    public items!: Item[];
    public total_price!: number;
}

// Define the user model schema
const cartSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customer_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    items: {
        type: DataTypes.JSONB,
        allowNull: false,
    },
    total_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
};

const initializeCart = (sequelize: Sequelize) => {
    Cart.init(cartSchema, {
        sequelize,
        modelName: 'cart',
        timestamps: false,
    });
};

const createCart = async (cart: CartCreationAttributes) => {
    return await Cart.create(cart);
};

const getCarts = async () => {
    const cartsData = await Cart.findAll();
    return cartsData;
}

const getCartID = async (query: {}) => {
    const cartData = await Cart.findOne({
        where: query
    });
    return cartData;
}

const deleteCart = async (query: {}) => {
    return await Cart.destroy({
        where: query
    });
}

const updateCart = async (data: {}, query: {}) => {
    return await Cart.update(data, {
        where: query
    });
}

const findCartOwner = async (query: {}) => {
    return await Cart.findOne({
        where: query
    })
}

export {
    initializeCart,
    createCart,
    getCarts,
    getCartID,
    deleteCart,
    updateCart,
    findCartOwner,
    Cart
};
