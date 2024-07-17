/* eslint-disable @typescript-eslint/no-explicit-any */
import { SetChat, ChatPreview, Message, User } from "../../types";

export const createChatSlice = (set: SetChat, get: any) => ({
  selectedChatData: undefined as User | undefined,
  selectedChatMessages: [] as Message[],
  chatPreviews: [] as ChatPreview[],

  setSelectedChatData: (data: object) => set({ selectedChatData: data }),
  setSelectedChatMessages: (data: Message[]) =>
    set({ selectedChatMessages: data }),
  setChatPreviews: (previews: ChatPreview[]) => set({ chatPreviews: previews }),

  closeChat: () => {
    set({
      selectedChatData: undefined,
      selectedChatMessages: [],
      chatPreviews: [],
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
