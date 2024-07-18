import { ReactNode } from "react";
import useAppStore from "../store";

const ChatScreen = ({ children }: { children: ReactNode }) => {
  const { selectedChatData } = useAppStore();

  if (!selectedChatData)
    return (
      <div className="min-h-screen flex items-center">
        <img src="/graphics/empty-chat-bg.jpeg" alt="select a chat" />
      </div>
    );

  return (
    <section className="flex flex-col h-screen overflow-hidden bg-[url('/images/chat-bg.jpg')] bg-cover ">
      {children}
    </section>
  );
};

export default ChatScreen;
