import jwt from "jsonwebtoken";
import UserModel from "../model/user.schema.js";

export const protectedRoute = async (req, res , next) => {
  
  try {
    const token = req.cookies?.authToken;
    
    if (!token) {
      return res.status(400).json({ message: "unauthorized request" });
    }

    const isValidToken = jwt.verify(token, process.env.JWT_KEY);
    if (!isValidToken) {
      return res.status(400).json({ message: "unauthorized request" });
    }

    const user = await UserModel.findById(isValidToken.userId).select(
      "-password"
    );

    if (!user) {
      return res
        .status(400)
        .json({ message: "user not fount unauthorized!.." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(`error in authorizing request ${error}`);
  }
};
