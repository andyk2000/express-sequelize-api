import Crypto from "crypto";
import ejs from "ejs";
import path from "path";
import { promisify } from "util";
import nodemailer from "nodemailer";
import { logger } from "../../logger";
import jwt from "jsonwebtoken";
import fs from "fs";

const readFileAsync = promisify(fs.readFile);

interface Config {
  email: string;
  password: string;
  secretKey: string;
  frontendLink: string;
}

const config: Config = {
  email: process.env.EMAIL_ADDRESS || "",
  password: process.env.EMAIL_PASSWORD || "",
  secretKey: process.env.SECRET_KEY || "",
  frontendLink: process.env.FRONTEND_LINK || "",
};

const generateAccessToken = (email: string, id: number) => {
  return jwt.sign(
    {
      id,
      email,
    },
    config.secretKey,
    {
      expiresIn: 3600,
    },
  );
};

const confirmationEmail = async (userEmail: string, names: string) => {
  try {
    const imageAttachment = await readFileAsync(
      path.join(__dirname, "../views/images/shopping-bag.png"),
      { encoding: "base64" },
    );

    const emailSent = await ejs.renderFile(
      path.join(__dirname, "../views/welcomeEmail.ejs"),
      {
        email: userEmail,
        user_firstname: names,
        confirm_link: config.frontendLink,
      },
    );

    const sender = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.email,
        pass: config.password,
      },
      debug: true,
      logger: true,
    });

    const newMail = {
      from: config.email,
      to: userEmail,
      subject: "Welcome to our online shop",
      html: emailSent,
      attachments: [
        {
          filename: "shopping-bag.png",
          content: imageAttachment,
          encoding: "base64",
          cid: "logo",
        },
      ],
    };

    sender.sendMail(newMail, (error, info) => {
      if (error) {
        logger.error("Error sending email:", error);
        throw error;
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    logger.error("email not sent on sign-up", error);
    throw error;
  }
};

const encryptPassword = (password: string) => {
  const hash = Crypto.createHash("sha256");
  hash.update(password);
  return hash.digest("hex");
};

export { encryptPassword, confirmationEmail, generateAccessToken };
