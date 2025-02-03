import express from "express";
import {
  checkAuth,
  login,
  logOut,
  signup,
  updateProfile,
  verifyEmail,
} from "../../controllers/auth.controller.js";
import { protectedRoute } from "../../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/logout" , logOut);
authRouter.put("/update-profile" , protectedRoute , updateProfile);
authRouter.get("/check-auth" , protectedRoute , checkAuth)

export default authRouter;
