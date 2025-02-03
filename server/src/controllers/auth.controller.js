import UserModel from "../model/user.schema.js";
import bcrypt from "bcrypt";
import { generateJwtToken, sendVerificationMail } from "../utils/utils.js";
import crypto from "crypto";

export const login = async (req, res) => {  
  const { email, password } = req.body;
    
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    const userRequested = await UserModel.findOne({ email: email });
    if (!userRequested) {
      return res.status(404).json({ message: "User not found." });
    }

    const userHashedPassword = userRequested.password;
    const isPasswordValid = await bcrypt.compare(password, userHashedPassword);

    if (!isPasswordValid) {
      res.status(400).json({ message: "Incorrect password." });
    }

    if (userRequested && isPasswordValid) {
      if (!userRequested.isVerified) {
        return res.status(400).json({ message: "Email is not verified" });
      }
      generateJwtToken(userRequested._id, res);
      return res.status(200).json({
        message: "login successful",
        _id: userRequested._id,
        email: userRequested.email,
        name: userRequested.name,
      });
    }
  } catch (error) {
    console.error(`error logging in ${error}`);
  }
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const emailRegex = /^[^\s@]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Invalid email. Only Gmail addresses are allowed." });
  }
  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exist with this email." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken: emailVerificationToken,
    });
    const verificationLink = `${process.env.BASE_URL_PATH_AUTH}/verify-email?auth=${emailVerificationToken}`;

    await newUser.save();

    sendVerificationMail(email, name, verificationLink);

    return res.status(201).json({
      message:
        "user registered please verify the email address sent to registered email.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating the user" });
  }
};

export const verifyEmail = async (req, res) => {
  const { auth } = req.query;

  if (!auth) {
    return res.status(400).json({ message: "verification failed" });
  }
  try {
    const userData = await UserModel.findOne({
      $or: [{ verificationToken: auth.trim() }, { isVerified: true }],
    });

    if (!userData) {
      return res
        .status(400)
        .json({ message: "verification failed could't able to find user" });
    }

    if (userData.isVerified) {
      return res.redirect(`${process.env.FRONT_END_BASE_URL}/login`);
    }

    userData.isVerified = true;
    userData.verificationToken = null;

    await userData.save();

    return res.redirect(`${process.env.FRONT_END_BASE_URL}/login`);
  } catch (error) {
    console.error(`error in verifying email ${error}`);
    return res.status(500).json({ message: "error in verifying email" });
  }
};

export const logOut = async (req, res) => {
  try {
    res.cookie("authToken", "", { maxAge: 0 });
    return res.status(200).json({ message: "logout successful" });
  } catch (error) {
    console.error(`error in logging out ${error}`);
    return res.status(500).json({ message: "Error in Logging out." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const userID = user._id;
    const { name } = req.body;

    await UserModel.findByIdAndUpdate(
      userID,
      {
        name: name,
      },
      { new: true }
    );

    return res.status(201).json({ message: "Profile updated." });
  } catch (error) {
    console.error(`Error updating profile ${error}`);
  }
};

export const checkAuth = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.error(`authentication failed ${error}`);
    return res.status(500).json({ message: "authentication failed " });
  }
};
