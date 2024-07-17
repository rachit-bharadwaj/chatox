/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetChat, Message, Contact } from "../../types";

export const createChatSlice = (set: SetChat, get: any) => ({
  selectedChatData: undefined as Contact | undefined,
  selectedChatMessages: [] as Message[],

  setSelectedChatData: (data: Contact) => set({ selectedChatData: data }),
  setSelectedChatMessages: (data: Message[]) =>
    set({ selectedChatMessages: data }),

  closeChat: () => {
    set({
      selectedChatData: undefined,
      selectedChatMessages: [],
    });
  },

  addMessage: (message: Message) => {
    const selectedChatMessages = get().selectedChatMessages;

    if (!Array.isArray(selectedChatMessages)) {
      console.error("selectedChatMessages is not an array");
      return;
    }

    if (!message || !message.sender || !message.receiver) {
      console.error("Message structure is incorrect:", message);
      return;
    }

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          receiver: message.receiver._id,
          sender: message.sender._id,
        },
      ],
    });
  },
});
