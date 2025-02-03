import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "verifychatapplication@gmail.com",
    pass: "dbni mvep swrr yjsb",
  },
});

export const sendVerificationMail = async (to, name, verificationLink) => {
  try {
    const templatePath = path.resolve(
      __dirname,
      "../static/VerificationEmail.html"
    );
    let emailTemplate = fs.readFileSync(templatePath, "utf8");

    emailTemplate = emailTemplate
      .replace("{{name}}", name)
      .replace("{{verificationLink}}", verificationLink);

    const mailOptions = {
      from: "verifychatapplication@gmail.com",
      to,
      subject: "Verify Your Email Address",
      html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
    console.log("email sent for verification");
  } catch (error) {
    console.error("error sending verification email " + error);
  }
};

export const generateJwtToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, {
    expiresIn: "1d",
  });
  sendCookieResponse(res, token);

  return token;
};

export const sendCookieResponse = (res, token) => {
  res.cookie("authToken", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  console.log('Cookie set:', res.getHeaders()['set-cookie']); // Add this

};
