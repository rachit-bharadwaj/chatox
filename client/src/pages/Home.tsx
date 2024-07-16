import { useState, useEffect } from "react";

// shadcn
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";

// components
import { ChatList, ChatScreen } from "../components/chat";

export default function Home() {
  const [chatLayoutSize, setChatLayoutSize] = useState<number[]>([20, 80]);
  const [initialized, setInitialized] = useState(false);

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

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen overflow-hidden w-full items-stretch"
      onLayout={handleLayoutChange}
    >
      <ResizablePanel defaultSize={chatLayoutSize[0]}>
        <ChatList />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={chatLayoutSize[1]}>
        <ChatScreen />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
