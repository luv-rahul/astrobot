const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    request: { type: String, required: true },
    response: { type: String },
  },
  { timestamps: true },
);

const conversationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    messages: [messageSchema],
  },
  { timestamps: true },
);

const chatSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    conversations: [conversationSchema],
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
