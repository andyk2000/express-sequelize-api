"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logIn = exports.signUp = exports.updateUserData = exports.deleteUserData = exports.getUserByID = exports.getAllUsers = exports.createNewUser = void 0;
const Users_1 = require("../models/Users");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const generateAccessToken = (email, id) => {
    return jwt.sign({
        id,
        email,
    }, "muu", {
        expiresIn: 3600,
    });
};
const confirmationEmail = (email) => {
    const sender = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'youremail@gmail.com',
            pass: '**********'
        }
    });
    var newMail = {
        from: 'andyirimbere@gmail.com',
        to: email,
        subject: `welcome to urubuto`,
        text: 'Welcome to URUBUTO, the best platform to connect you with your customers and stores across Rwanda'
    };
    sender.sendMail(newMail, function () {
        console.log('Email sent: ');
    });
};
const createNewUser = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { names, email, password, role } = request.body;
    console.log({ names, email, password, role });
    try {
        const data = yield (0, Users_1.createUser)({ names, email, password, role });
        console.log(data);
        return response.status(201).json(data);
    }
    catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createNewUser = createNewUser;
const getAllUsers = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, Users_1.getUsers)();
        return response.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send("failed to get the data");
    }
});
exports.getAllUsers = getAllUsers;
const getUserByID = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id);
    try {
        const userData = yield (0, Users_1.getUserID)({ id: id });
        return response.status(200).json(userData);
    }
    catch (err) {
        console.log(err);
        response.status(500).send(`failed to get user with id${id}`);
    }
});
exports.getUserByID = getUserByID;
const deleteUserData = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id);
    try {
        const deletedUser = yield (0, Users_1.deleteUser)({ id: id });
        return response.status(200).json(deletedUser);
    }
    catch (error) {
        console.log(error);
        response.status(200).json(`failed to delete user with id${id}`);
    }
});
exports.deleteUserData = deleteUserData;
const updateUserData = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(request.params.id);
    const { names, email, password, role } = request.body;
    try {
        const updatedUser = yield (0, Users_1.updateUser)({ names, email, password, role }, { id: id });
        return response.status(200).json(updatedUser);
    }
    catch (error) {
        console.log(error);
        response.status(200).json(`failed to update the user with id${id}`);
    }
});
exports.updateUserData = updateUserData;
const encryptPassword = (password) => {
    const hash = crypto_1.default.createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
};
const signUp = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    let { names, email, password, role } = request.body;
    password = encryptPassword(password);
    try {
        const newUser = yield (0, Users_1.createUser)({ names, email, password, role });
        confirmationEmail(email);
        return response.status(200).json(newUser);
    }
    catch (error) {
        console.log(error);
        return response.status(200).send("could not creat the new user");
    }
});
exports.signUp = signUp;
const logIn = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    const encrypted = encryptPassword(password);
    try {
        const user = yield (0, Users_1.getUserEmail)({ email: email });
        if (user === null) {
            return response.status(404).send("login failed try again");
        }
        if (user.password !== encrypted) {
            return response.status(404).send("login failed try again");
        }
        const token = generateAccessToken(user.email, user.id);
        return response.status(200).send(token);
    }
    catch (error) {
        console.log(error);
        return response.status(500).send("failed to login");
    }
});
exports.logIn = logIn;
