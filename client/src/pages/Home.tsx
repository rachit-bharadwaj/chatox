import { useState, useEffect } from "react";

// shadcn
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";

// components
import {
  ChatInputBar,
  ChatList,
  ChatScreenHeader,
  Messages,
} from "../components/chat";

// containers
import { ChatScreen } from "../containers";
import useAppStore from "../store";

export default function Home() {
  const [chatLayoutSize, setChatLayoutSize] = useState<number[]>([40, 60]);
  const [initialized, setInitialized] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const { selectedChatData } = useAppStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const storedSize = localStorage.getItem("chat-layout-size");
    if (storedSize) {
      setChatLayoutSize(JSON.parse(storedSize));
    }
    setInitialized(true);
  }, []);

  const handleLayoutChange = (size: number[]) => {
    setChatLayoutSize(size);
    localStorage.setItem("chat-layout-size", JSON.stringify(size));
  };

  if (!initialized) return null;

  return isMobileView ? (
    <>
      {selectedChatData ? (
        <ChatScreen>
          <ChatScreenHeader />
          <Messages />
          <ChatInputBar />
        </ChatScreen>
      ) : (
        <ChatList />
      )}
    </>
  ) : (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen overflow-hidden w-full items-stretch"
        onLayout={handleLayoutChange}
      >
        <ResizablePanel minSize={25} defaultSize={chatLayoutSize[0]}>
          <ChatList />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={chatLayoutSize[1]}>
          <ChatScreen>
            <ChatScreenHeader />
            <Messages />
            <ChatInputBar />
          </ChatScreen>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
