import { ChangeEvent, useState, KeyboardEvent } from "react";
import EmojiPicker from "emoji-picker-react";
import useAppStore from "../../store";
import { cn } from "../../lib/utils";
import { useSocket } from "../../contexts/useSocket";

// icons
import { RiEmojiStickerLine } from "react-icons/ri";

export default function ChatInputBar() {
  const { selectedChatData, userData } = useAppStore();
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const socket = useSocket();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addEmoji = (emoji: any) => {
    setMessage(message + emoji.emoji);
  };

  const sendMessage = async () => {
    if (!selectedChatData?._id) {
      console.error("No selected chat data");
      return;
    }

    socket?.emit("sendMessage", {
      sender: userData._id,
      receiver: selectedChatData._id,
      message,
      messageType: "text",
    });
    setMessage("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage();
      // remove focus from the input bar
      event.currentTarget.blur();
    }
  };

  return (
    <div className="flex p-3 gap-2 items-center w-full">
      <div className="bg-gray-50 border-2 w-full flex p-3 rounded-2xl shadow">
        <input
          type="text"
          className="outline-none bg-transparent flex-1"
          placeholder="Message"
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <button onClick={() => setEmojiPicker((prev) => !prev)}>
          <RiEmojiStickerLine
            className={cn(`text-gray-500 text-2xl`, {
              "text-yellow-500": emojiPicker,
            })}
          />
        </button>

        <div className="absolute bottom-20 right-0">
          <EmojiPicker open={emojiPicker} onEmojiClick={addEmoji} />
        </div>
      </div>

      <button
        className="bg-white p-3 h-12 w-12 min-h-fit text-center rounded-full shadow"
        onClick={sendMessage}
      >
        <img src="/icons/send.svg" alt="send" />
      </button>
    </div>
  );
}
