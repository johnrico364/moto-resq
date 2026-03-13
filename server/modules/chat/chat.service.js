import Chat from './chat.model.js';

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
    }
}