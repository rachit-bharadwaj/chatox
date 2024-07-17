/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from "react";

import useAppStore from "../../store";

import EmojiPicker from "emoji-picker-react";

// icons
import { MdAttachFile } from "react-icons/md";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { cn } from "../../lib/utils";
import { useSocket } from "../../contexts/useSocket";

export default function ChatInputBar() {
  const { selectedChatData, userData } = useAppStore();
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const socket = useSocket();

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
    console.log("sender: ", userData._id);
    console.log("reciever: ", selectedChatData._id);
    setMessage("");
  };

  return (
    <div className="flex p-3 gap-2 items-center">
      <div className="bg-gray-50 flex p-3 rounded-lg shadow">
        <input
          type="text"
          className="outline-none bg-transparent w-full"
          placeholder="Message"
          value={message}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
        />

        <div className="flex gap-3">
          <MdAttachFile className="text-gray-500 text-2xl" />

          <div>
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
        </div>
      </div>

      <button
        className="bg-white p-3 h-12 w-12 min-h-fit text-center rounded-full shadow"
        onClick={sendMessage}
      >
        <IoSend className="text-green-500 text-2xl" />
      </button>
    </div>
  );
}
