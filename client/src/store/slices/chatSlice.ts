import { SetChat, ChatPreview, User } from "../../types";

export const createChatSlice = (set: SetChat, get: any) => ({
  selectedChatData: <User>{},
  selectedChatMessages: [] as object[],
  chatPreviews: [] as ChatPreview[],

  setSelectedChatData: (data: object) => set({ selectedChatData: data }),
  setSelectedChatMessages: (data: object[]) => set({ selectedChatMessages: data }),
  setChatPreviews: (previews: ChatPreview[]) => set({ chatPreviews: previews }),

  closeChat: () => {
    set({
      selectedChatData: undefined,
      selectedChatMessages: [],
      chatPreviews: [],
    });
  },

  addMessage: (message: any) => {
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
          sender: {
            name: message.sender.name,
            profilePicture: message.sender.profilePicture,
            _id: message.sender._id,
          },
          receiver: {
            name: message.receiver.name,
            profilePicture: message.receiver.profilePicture,
            _id: message.receiver._id,
          },
        },
      ],
    });
  },
});
