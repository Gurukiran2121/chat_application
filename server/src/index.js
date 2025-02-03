import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import authRouter from "./routes/auth/user.auth.js";
import timeout from "connect-timeout";
import { connectDB } from "./db/db.connection.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message/user.message.js";
const app = express();
dotenv.config();
const port = process.env.PORT || 3008;
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONT_END_BASE_URL, credentials: true }));

app.use(timeout("1m"));
app.use(haltOnTimedout);
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

const server = http.createServer(app);

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_END_BASE_URL,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const onlineUsers = {};

export const getUserSocketId = (userId) => {
  return onlineUsers[userId];
};

io.on("connection", (socketId) => {
  const userId = socketId?.handshake?.query?.userId;
  console.log(`socket connected`);

  console.log(userId, "userId");

  if (userId) {
    onlineUsers[userId] = socketId.id;
  }
  io.emit("getOnlineUsers", onlineUsers);

  socketId.on("disconnect", () => {
    console.log("user disconnected from socket");
  });
});

server.listen(port, () => {
  console.log(`server started at port ${port}`);
  connectDB();
});
