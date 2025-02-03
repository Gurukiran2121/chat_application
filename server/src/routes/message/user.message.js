import express from "express";
import { protectedRoute } from "../../middleware/auth.middleware.js";
import { getAllMessages, getAllUsers, postMessageToUser } from "../../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectedRoute, getAllUsers);
messageRouter.get("/:id", protectedRoute, getAllMessages);
messageRouter.post("/send/:id" , protectedRoute , postMessageToUser);

export default messageRouter;
