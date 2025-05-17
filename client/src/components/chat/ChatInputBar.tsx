import { ChangeEvent, useState, KeyboardEvent, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import useAppStore from "../../store";
import { cn } from "../../lib/utils";
import { useSocket } from "../../contexts/useSocket";

// icons
import { RiEmojiStickerLine } from "react-icons/ri";
import { MdGif } from "react-icons/md";
import { FiSearch } from "react-icons/fi";

const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

// GIPHY API response types
interface GiphyImage {
  url: string;
  width: string;
  height: string;
}

interface GiphyImages {
  fixed_height: GiphyImage;
}

interface GiphyGif {
  id: string;
  images: GiphyImages;
}

interface GiphyResponse {
  data: GiphyGif[];
}

export default function ChatInputBar() {
  const { selectedChatData, userData } = useAppStore();
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [gifPicker, setGifPicker] = useState(false);
  const [message, setMessage] = useState("");
  const socket = useSocket();
  const [gifs, setGifs] = useState<Array<{id: string, url: string}>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGifLoading, setIsGifLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addEmoji = (emoji: any) => {
    setMessage(message + emoji.emoji);
  };

  const selectGif = (gifUrl: string) => {
    setGifPicker(false);
    sendGif(gifUrl);
  };

  const fetchGifs = async (query: string = "") => {
    setIsGifLoading(true);
    try {
      const endpoint = query 
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=20` 
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20`;
        
      const response = await fetch(endpoint);
      const data = await response.json() as GiphyResponse;
      
      const formattedGifs = data.data.map((gif: GiphyGif) => ({
        id: gif.id,
        url: gif.images.fixed_height.url
      }));
      
      setGifs(formattedGifs);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
    } finally {
      setIsGifLoading(false);
    }
  };

  useEffect(() => {
    if (gifPicker) {
      fetchGifs();
    }
  }, [gifPicker]);

  const handleGifSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchGifs(searchQuery);
    }
  };

  const sendGif = async (gifUrl: string) => {
    if (!selectedChatData?._id) {
      console.error("No selected chat data");
      return;
    }

    socket?.emit("sendMessage", {
      sender: userData._id,
      receiver: selectedChatData._id,
      message: gifUrl,
      messageType: "gif",
    });
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

  // Support for native keyboard GIFs via file input
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if the file is a GIF
    if (file.type === "image/gif") {
      const reader = new FileReader();
      reader.onload = (event) => {
        const gifDataUrl = event.target?.result as string;
        if (gifDataUrl) {
          sendGif(gifDataUrl);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only GIF files are supported");
    }
    
    // Clear the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle paste events to capture pasted GIFs
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image/gif") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const gifDataUrl = event.target?.result as string;
            if (gifDataUrl) {
              sendGif(gifDataUrl);
            }
          };
          reader.readAsDataURL(blob);
          e.preventDefault(); // Prevent default paste behavior
          return;
        }
      }
    }
  };

  // Enhanced GIF picker component with GIPHY integration
  const GifPicker = () => {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg w-80 h-60 overflow-hidden flex flex-col">
        {/* Search bar */}
        <form onSubmit={handleGifSearch} className="mb-2 flex">
          <input
            type="text"
            placeholder="Search GIFs..."
            className="w-full px-3 py-2 border rounded-l-md focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-[#615ef0] text-white px-3 py-2 rounded-r-md"
          >
            <FiSearch />
          </button>
        </form>
        
        {/* GIFs container */}
        <div className="overflow-y-auto flex-1 grid grid-cols-2 gap-2">
          {isGifLoading ? (
            <div className="col-span-2 flex justify-center items-center h-full">
              <p>Loading GIFs...</p>
            </div>
          ) : gifs.length > 0 ? (
            gifs.map((gif) => (
              <img
                key={gif.id}
                src={gif.url}
                alt="gif"
                className="w-full h-32 object-cover cursor-pointer rounded-md hover:opacity-80"
                onClick={() => selectGif(gif.url)}
              />
            ))
          ) : (
            <div className="col-span-2 flex justify-center items-center h-full">
              <p>No GIFs found. Try another search.</p>
            </div>
          )}
        </div>
      </div>
    );
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
          onPaste={handlePaste}
        />

        <div className="flex gap-2">
          <button 
            onClick={() => {
              setEmojiPicker((prev) => !prev);
              setGifPicker(false);
            }}
          >
            <RiEmojiStickerLine
              className={cn(`text-gray-500 text-2xl`, {
                "text-yellow-500": emojiPicker,
              })}
            />
          </button>
          
          <button 
            onClick={() => {
              setGifPicker((prev) => !prev);
              setEmojiPicker(false);
            }}
          >
            <MdGif
              className={cn(`text-gray-500 text-2xl`, {
                "text-blue-500": gifPicker,
              })}
            />
          </button>
          
          {/* Hidden file input for keyboard/device GIFs */}
          <input 
            type="file" 
            accept="image/gif" 
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileInput}
          />
          
          {/* Button to trigger native GIF selection */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            title="Upload a GIF from your device"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
              <line x1="16" y1="5" x2="22" y2="5"></line>
              <line x1="19" y1="2" x2="19" y2="8"></line>
              <circle cx="9" cy="9" r="2"></circle>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            </svg>
          </button>
        </div>

        <div className="absolute bottom-20 right-0 z-10">
          {emojiPicker && <EmojiPicker open={emojiPicker} onEmojiClick={addEmoji} />}
          {gifPicker && <GifPicker />}
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
