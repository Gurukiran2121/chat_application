import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderID: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverID: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
