import { DataTypes, Sequelize, Model, Optional } from 'sequelize';

// Define the attributes for the User model
interface UserAttributes {
    id: number;
    names: string;
    email: string;
    password: string;
    role: string;
}

// Define the attributes for creating a User (id is optional)
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Define the User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public names!: string;
    public email!: string;
    public password!: string;
    public role!: string;
}

// Define the user model schema
const userSchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    names: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "customer",
    }
};

const initializeUser = (sequelize: Sequelize) => {
    User.init(userSchema, {
        sequelize,
        modelName: 'user',
        timestamps: false,
    });
};

const createUser = async (user: UserCreationAttributes) => {
    return await User.create(user);
};

const getUsers = async () => {
    const usersData = await User.findAll();
    return usersData;
}

const getUserID = async (query: {}) => {
    const userData = await User.findOne({
        where: query
    });
    return userData;
}

const getUserEmail = async (query: {}) => {
    const userData = await User.findOne({
        where: query
    });
    return userData;
}

const deleteUser = async (query: {}) => {
    return await User.destroy({
        where: query
    });
}

const updateUser = async (data: {}, query: {}) => {
    return await User.update(data, {
        where: query
    });
}
export {
    initializeUser,
    createUser,
    getUsers,
    getUserID,
    deleteUser,
    updateUser,
    getUserEmail
};
