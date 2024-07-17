import { SetChat, ChatPreview, User } from "../../types";

export const createChatSlice = (set: SetChat) => ({
  selectedChatData: <User>{},
  selectedChatMessages: [] as object[],
  chatPreviews: [] as ChatPreview[],

  setSelectedChatData: (data: object) => set({ selectedChatData: data }),
  setSelectedChatMessages: (data: object[]) =>
    set({ selectedChatMessages: data }),
  setChatPreviews: (previews: ChatPreview[]) => set({ chatPreviews: previews }),

  closeChat: () => {
    set({
      selectedChatData: undefined,
      selectedChatMessages: [],
      chatPreviews: [],
    });
  },
});
