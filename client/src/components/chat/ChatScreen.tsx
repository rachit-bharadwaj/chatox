import { ChangeEvent, useState } from "react";

import useAppStore from "../../store";

import EmojiPicker from "emoji-picker-react";

// icons
import { TiUser } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { MdAttachFile } from "react-icons/md";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import { cn } from "../../lib/utils";

export default function ChatScreen() {
  const { selectedChatData, closeChat } = useAppStore();

  const [emojiPicker, setEmojiPicker] = useState(false);

  const [message, setMessage] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addEmoji = (emoji: any) => {
    setMessage(message + emoji.emoji);
  };

  return (
    <section className="h-full">
      {selectedChatData ? (
        <div className="flex flex-col h-full bg-[url('/images/chat-bg.jpg')] bg-cover ">
          <header className="flex text-gray-900 justify-between items-center border-b p-3 bg-white">
            <div className="w-fit">
              {selectedChatData?.profilePicture ? (
                <img
                  src={selectedChatData?.profilePicture}
                  alt={selectedChatData?.name}
                  className="w-7 h-7 rounded-full"
                />
              ) : (
                <div className="rounded-full border p-3">
                  <TiUser className="h-7 w-7 text-gray-500" />
                </div>
              )}
            </div>

            <p className="text-lg">{selectedChatData?.name}</p>

            <button
              className="hover:text-red-500"
              onClick={() => {
                closeChat();
              }}
            >
              <ImCross className="text-gray-500 text-xl" />
            </button>
          </header>

          <div className="h-full flex-1"></div>

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

            <button className="bg-white p-3 h-12 w-12 min-h-fit text-center rounded-full shadow">
              <IoSend className="text-green-500 text-2xl" />
            </button>
          </div>
        </div>
      ) : (
        "select a chat"
      )}
    </section>
  );
}
