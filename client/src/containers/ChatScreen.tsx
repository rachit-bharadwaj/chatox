import { ReactNode } from "react";
import useAppStore from "../store";

const ChatScreen = ({ children }: { children: ReactNode }) => {
  const { selectedChatData } = useAppStore();

  if (!selectedChatData) return "Select chat...";

  return (
    <section className="flex flex-col h-full bg-[url('/images/chat-bg.jpg')] bg-cover ">
      {children}
    </section>
  );
};

export default ChatScreen;
