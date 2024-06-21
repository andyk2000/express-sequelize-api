import { DataTypes, Sequelize, Model, Optional, Op } from "sequelize";

interface UserAttributes {
  id: number;
  names: string;
  email: string;
  password: string;
  role: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public names!: string;
  public email!: string;
  public password!: string;
  public role!: string;
}

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
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "customer",
  },
};

const initializeUser = (sequelize: Sequelize) => {
  User.init(userSchema, {
    sequelize,
    modelName: "user",
    timestamps: false,
  });
};

const createUser = async (user: UserCreationAttributes) => {
  return await User.create(user);
};

const getUsers = async () => {
  const usersData = await User.findAll();
  return usersData;
};

const getUserID = async (id: number) => {
  const userData = await User.findOne({
    where: {
      id: id,
    },
  });
  return userData;
};

const getUserEmail = async (email: string) => {
  const userData = await User.findOne({
    where: {
      email: email,
    },
  });
  return userData;
};

const deleteUser = async (id: number) => {
  return await User.destroy({
    where: {
      id: id,
    },
  });
};

const updateUser = async (
  data: NonNullable<unknown>,
  query: NonNullable<unknown>,
) => {
  return await User.update(data, {
    where: query,
  });
};

const searchCustomerByName = async (search_string: string) => {
  const customers = await User.findAll({
    where: {
      names: {
        [Op.like]: `%${search_string}%`,
      },
      role: "customer",
    },
  });
  return customers;
};

export {
  initializeUser,
  createUser,
  getUsers,
  getUserID,
  deleteUser,
  updateUser,
  getUserEmail,
  searchCustomerByName,
  User,
};
