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
  const [showChatScreen, setShowChatScreen] = useState(false);

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

  useEffect(() => {
    if (isMobileView && selectedChatData) {
      setShowChatScreen(true);
      window.history.pushState(null, "");
    }
  }, [isMobileView, selectedChatData]);

  useEffect(() => {
    const handlePopState = () => {
      if (isMobileView && showChatScreen) {
        setShowChatScreen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isMobileView, showChatScreen]);

  const handleLayoutChange = (size: number[]) => {
    setChatLayoutSize(size);
    localStorage.setItem("chat-layout-size", JSON.stringify(size));
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return isMobileView ? (
    <>
      {showChatScreen && selectedChatData ? (
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
        className="min-h-screen w-full items-stretch"
        onLayout={handleLayoutChange}
      >
        <ResizablePanel minSize={35} defaultSize={chatLayoutSize[0]} className="overflow-hidden">
          <div className="h-screen overflow-y-auto">
            <ChatList />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={45} defaultSize={chatLayoutSize[1]} className="overflow-hidden">
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
