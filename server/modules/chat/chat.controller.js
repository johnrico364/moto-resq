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

export const sendMessage = async (req, res) => {
  try {
    const { request_id } = req.params;
    const messageData = req.body

    const chat = await ChatService.sendMessage(request_id, messageData);
    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}