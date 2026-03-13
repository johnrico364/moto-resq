import { ChatService } from "./chat.service.js";

export const getChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await ChatService.getChat(id);
    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
