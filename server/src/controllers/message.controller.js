import { getUserSocketId, io } from "../index.js";
import messageModel from "../model/message.schema.js";
import UserModel from "../model/user.schema.js";

export const getAllUsers = async (req, res) => {
  try {
    const requestingUserId = req.user._id; //id of a user who is requesting all users

    const allUsers = await UserModel.find({
      _id: { $ne: requestingUserId },
    }).select("-password");

    return res.status(200).json(allUsers);
  } catch (error) {
    console.error(`error in getting users ${error}`);
    return res.status(500).json({ message: "error in getting users" });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    //requestingUserId is me and idToSendMessageTo is another person i want to message
    const requestingUserId = req.user._id; //user who is requesting the chats
    const { id: idToSendMessageTo } = req.params; //since if logged in user clicks the individual user chat have to load conversation between those users

    const conversation = await messageModel.find({
      $or: [
        {
          senderID: requestingUserId,
          receiverID: idToSendMessageTo,
        },
        {
          senderID: idToSendMessageTo,
          receiverID: requestingUserId,
        },
      ],
    });

    return res.status(200).json(conversation);
  } catch (error) {
    console.error(`Error in loading messages. ${error}`);
    return res.status(500).json({ message: "Error in loading messages." });
  }
};

export const postMessageToUser = async (req, res) => {
  try {
    const postingUserId = req.user._id; //user who is logged in can only send the message to others
    const { id: idToSendMessageTo } = req.params;

    const { message } = req.body;

    const conversation = new messageModel({
      senderID: postingUserId,
      receiverID: idToSendMessageTo,
      message: message,
    });

    await conversation.save();

    const userSocketId = getUserSocketId(idToSendMessageTo);
    console.log(userSocketId);
    
    if (userSocketId) {      
      io.to(userSocketId).emit("getSentMessage", conversation);
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.error(`Error sending the message ${error}`);
    return res.status(500).json({ message: "Error sending the message" });
  }
};
