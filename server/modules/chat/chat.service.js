import Chat from "./chat.model.js";

export const ChatService = {
  // GET CHAT THREAD =================================================
  async getChat(id) {
    if (!id) {
      throw new Error("Request ID is required");
    }
    const chat = await Chat.findOne({ request_id: id });
    if (!chat) {
      throw new Error("Chat thread not found for this service request");
    }
    return chat;
  },

  // SEND MESSAGE ====================================================
  async sendMessage(requestId, messageData) {
    let chat = await Chat.findOne({ request_id: requestId });
    if (!chat) {
      chat = await Chat.create({ request_id: requestId, messages: [] });
    }

    const newMessage = {
      sender_id: messageData.sender_id,
      sender_type: messageData.sender_type,
      message: messageData.message.trim(),
    };

    chat.messages.push(newMessage);
    await chat.save();
    return chat;
  },
};
