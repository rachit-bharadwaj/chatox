import { ChangeEvent, useState, useEffect, useRef, DragEvent } from "react";
import EmojiPicker from "emoji-picker-react";
import useAppStore from "../../store";
import { cn } from "../../lib/utils";
import { useSocket } from "../../contexts/useSocket";
import { useCrypto } from "../../hooks/useCrypto";

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
  const { encryptMessage, canEncrypt } = useCrypto();
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [gifPicker, setGifPicker] = useState(false);
  const [message, setMessage] = useState("");
  const socket = useSocket();
  const [gifs, setGifs] = useState<Array<{id: string, url: string}>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGifLoading, setIsGifLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isWindowsGifKeyboardOpen, setIsWindowsGifKeyboardOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addEmoji = (emoji: any) => {
    setMessage(message + emoji.emoji);
  };

  const selectGif = (gifUrl: string) => {
    setGifPicker(false);
    sendGif(gifUrl);
    // Focus back on the input after selecting a GIF
    inputRef.current?.focus();
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

  // Windows GIF keyboard detection
  useEffect(() => {
    const detectWindowsGifKeyboard = () => {
      // Look for Tenor GIF divs that Windows keyboard creates
      const tenorElements = document.querySelectorAll('[class*="tenor"], [id*="tenor"], [aria-label*="gif"], [title*="gif"]');
      setIsWindowsGifKeyboardOpen(tenorElements.length > 0);
      
      // Special handling for the Windows Tenor GIF keyboard
      const tenorGifFrames = document.querySelectorAll('iframe[src*="tenor"]');
      if (tenorGifFrames.length > 0) {
        setIsWindowsGifKeyboardOpen(true);
      }
    };

    // Check periodically for Windows GIF keyboard
    const intervalId = setInterval(detectWindowsGifKeyboard, 500);
    
    // Keyboard shortcuts for Windows emoji picker (Win + .) often show GIFs
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '.' && e.metaKey) || (e.key === '.' && e.ctrlKey) || 
          (e.key === 'v' && e.ctrlKey) || (e.key === 'v' && e.metaKey)) {
        // Short delay to let the emoji picker open
        setTimeout(detectWindowsGifKeyboard, 200);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Enhanced Windows Tenor GIF detection
  useEffect(() => {
    // This handles GIFs from Windows Tenor keyboard
    const handleWindowsGifSelection = () => {
      // Windows often inserts GIFs as images or via clipboard
      if (isWindowsGifKeyboardOpen) {
        // Short delay to let the GIF be selected
        setTimeout(() => {
          // Check if an image was added to the DOM recently
          const images = document.querySelectorAll('img[src*="tenor"], img[src*="giphy"]');
          images.forEach(img => {
            const gifUrl = (img as HTMLImageElement).src;
            if (gifUrl && gifUrl.includes('gif')) {
              sendGif(gifUrl);
              // Remove the image as we're handling it separately
              img.remove();
            }
          });
        }, 100);
      }
    };

    // Events that might indicate a GIF was selected
    document.addEventListener('click', handleWindowsGifSelection);
    document.addEventListener('mouseup', handleWindowsGifSelection);
    
    return () => {
      document.removeEventListener('click', handleWindowsGifSelection);
      document.removeEventListener('mouseup', handleWindowsGifSelection);
    };
  }, [isWindowsGifKeyboardOpen]);

  // Enhanced clip detection for Windows 11 clipboard/keyboard inserts
  const handleInputChangeForGifs = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    // Check if this might be a Windows Tenor GIF
    // Windows often adds the GIF URL to the input or surrounded by special characters
    if (e.target.value.includes('tenor.com') || e.target.value.includes('giphy.com') || 
        e.target.value.includes('.gif') || e.target.value.match(/https?:\/\/[^\s]+\.(gif|gifv)/i)) {
      
      // Extract potential GIF URLs
      const urlMatch = e.target.value.match(/https?:\/\/[^\s]+\.(gif|gifv|webp|png|jpg|jpeg)/i);
      if (urlMatch && urlMatch[0]) {
        // We found a GIF URL, send it
        sendGif(urlMatch[0]);
        // Clear the input after sending
        setMessage('');
      }
    }
  };

  // Maintain focus on search input when typing
  useEffect(() => {
    if (searchFocused && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    // Reset to trending GIFs when search is cleared
    if (searchQuery === "" && gifPicker) {
      fetchGifs();
    }
  }, [searchQuery, searchFocused, gifPicker]);

  // Add support for keyboard GIFs via file input
  useEffect(() => {
    // Set up global handlers for keyboard GIFs
    const handleKeyboardGif = (event: ClipboardEvent) => {
      // This catches clipboard GIFs inserted by keyboard
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement.tagName === 'INPUT' && activeElement === inputRef.current) {
        // Check if there's an image in the DataTransfer
        setTimeout(() => {
          const clipboardItems = event.clipboardData?.items;
          if (clipboardItems) {
            for (let i = 0; i < clipboardItems.length; i++) {
              if (clipboardItems[i].type.indexOf('image/') !== -1) {
                const blob = clipboardItems[i].getAsFile();
                if (blob) {
                  processGifFile(blob);
                  event.preventDefault();
                }
              } else if (clipboardItems[i].type === 'text/plain') {
                // Check if the text might be a GIF URL
                clipboardItems[i].getAsString((text) => {
                  if (text.match(/https?:\/\/[^\s]+\.(gif|gifv|webp|png|jpg|jpeg)/i)) {
                    sendGif(text);
                    event.preventDefault();
                  }
                });
              }
            }
          }
        }, 0);
      }
    };

    // Handle drop events globally
    const handleDrop = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
      const dragEvent = e as unknown as DragEvent;
      if (dragEvent.dataTransfer?.files && dragEvent.dataTransfer.files.length > 0) {
        const file = dragEvent.dataTransfer.files[0];
        if (file.type.includes('image/')) {
          processGifFile(file);
        }
      } else if (dragEvent.dataTransfer?.items) {
        // Handle items from system keyboard
        for (let i = 0; i < dragEvent.dataTransfer.items.length; i++) {
          if (dragEvent.dataTransfer.items[i].kind === 'file' && 
              dragEvent.dataTransfer.items[i].type.indexOf('image/') !== -1) {
            const file = dragEvent.dataTransfer.items[i].getAsFile();
            if (file) {
              processGifFile(file);
            }
          } else if (dragEvent.dataTransfer.items[i].kind === 'string' && 
                   dragEvent.dataTransfer.items[i].type === 'text/uri-list') {
            // Handle GIF URLs dropped from browsers or apps
            dragEvent.dataTransfer.items[i].getAsString((url) => {
              if (url.match(/\.(gif|gifv|webp|png|jpg|jpeg)($|\?)/i)) {
                sendGif(url);
              }
            });
          }
        }
      }
    };

    const handleDragOver = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Specific handler for Windows GIF keyboard
    const handleMessage = (event: MessageEvent) => {
      // Windows Tenor keyboard might send postMessage events
      if (event.data && typeof event.data === 'string') {
        try {
          const data = JSON.parse(event.data);
          // Look for GIF data in various formats
          if (data.url && (data.url.includes('.gif') || data.url.includes('tenor.com') || data.url.includes('giphy.com'))) {
            sendGif(data.url);
          } else if (data.gif || data.gifUrl || data.image || data.imageUrl) {
            sendGif(data.gif || data.gifUrl || data.image || data.imageUrl);
          }
        } catch (e) {
          // If it's a string URL directly
          if (event.data.match(/https?:\/\/[^\s]+\.(gif|gifv|webp|png|jpg|jpeg)/i)) {
            sendGif(event.data);
          }
        }
      }
    };

    // Add event listeners to the whole chat area
    if (chatAreaRef.current) {
      chatAreaRef.current.addEventListener('paste', handleKeyboardGif as EventListener);
      chatAreaRef.current.addEventListener('drop', handleDrop);
      chatAreaRef.current.addEventListener('dragover', handleDragOver);
    }

    // Global listeners for various events
    document.addEventListener('paste', handleKeyboardGif as EventListener);
    window.addEventListener('message', handleMessage);
    
    return () => {
      if (chatAreaRef.current) {
        chatAreaRef.current.removeEventListener('paste', handleKeyboardGif as EventListener);
        chatAreaRef.current.removeEventListener('drop', handleDrop);
        chatAreaRef.current.removeEventListener('dragover', handleDragOver);
      }
      document.removeEventListener('paste', handleKeyboardGif as EventListener);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Process GIF files (from drag and drop or clipboard)
  const processGifFile = (file: File) => {
    if (file.type.includes('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const gifDataUrl = event.target?.result as string;
        if (gifDataUrl) {
          sendGif(gifDataUrl);
          // Clear any text input that might have been created by the GIF insertion
          setMessage('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle keyboard GIF selection
  const handleKeyboardGifSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file input change (for keyboard GIFs)
  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processGifFile(file);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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

    // Clear any text that might have been added when the GIF was selected
    setMessage('');

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

    if (!message.trim()) {
      return; // Don't send empty messages
    }

    let messageData: any = {
      sender: userData._id,
      receiver: selectedChatData._id,
      messageType: "text",
    };

    // Try to encrypt the message if crypto is available
    if (canEncrypt) {
      try {
        const encryptionResult = await encryptMessage(message, selectedChatData._id);
        if (encryptionResult) {
          messageData = {
            ...messageData,
            message: encryptionResult.encrypted.ciphertext,
            encrypted: true,
            sessionKeyId: encryptionResult.encrypted.sessionKeyId,
            encryptedSessionKey: encryptionResult.encryptedSessionKey,
            iv: encryptionResult.encrypted.iv,
          };
        } else {
          // Fallback to unencrypted if encryption fails
          messageData.message = message;
          messageData.encrypted = false;
        }
      } catch (error) {
        console.error("Encryption failed, sending unencrypted:", error);
        messageData.message = message;
        messageData.encrypted = false;
      }
    } else {
      // Send unencrypted if crypto not available
      messageData.message = message;
      messageData.encrypted = false;
    }

    socket?.emit("sendMessage", messageData);
    setMessage("");
    
    // Maintain focus on the input after sending
    inputRef.current?.focus();
  };

  // The Enter key will no longer send messages
  const handleKeyDown = () => {
    // Do nothing on Enter key - only send with button click
  };

  // Handle paste events to capture pasted GIFs
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image/") !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          processGifFile(blob);
          e.preventDefault(); // Prevent default paste behavior
          return;
        }
      } else if (items[i].type === 'text/plain') {
        // Check if the text might be a GIF URL
        items[i].getAsString((text) => {
          if (text.match(/https?:\/\/[^\s]+\.(gif|gifv|webp|png|jpg|jpeg)/i)) {
            sendGif(text);
            e.preventDefault();
          }
        });
      }
    }
  };

  // Enhanced GIF picker component with GIPHY integration
  const GifPicker = () => {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg w-80 h-60 overflow-hidden flex flex-col">
        {/* Search bar with ref to maintain focus */}
        <form onSubmit={handleGifSearch} className="mb-2 flex">
          <input
            type="text"
            placeholder="Search GIFs..."
            className="w-full px-3 py-2 border rounded-l-md focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            ref={searchInputRef}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <button 
            type="submit" 
            className="bg-[#615ef0] text-white px-3 py-2 rounded-r-md"
          >
            <FiSearch />
          </button>
        </form>
        
        {/* GIFs container */}
        <div 
          className="overflow-y-auto flex-1 grid grid-cols-2 gap-2"
          onClick={(e) => e.stopPropagation()} // Prevent losing focus when clicking in container
        >
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
    <div className="flex p-3 gap-2 items-center w-full" ref={chatAreaRef}>
      {/* Hidden file input for native keyboard GIFs */}
      <input
        type="file"
        accept="image/gif,image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInputChange}
      />
      
      <div className="bg-gray-50 border-2 w-full flex p-3 rounded-2xl shadow">
        <input
          type="text"
          className="outline-none bg-transparent flex-1"
          placeholder="Message"
          value={message}
          onChange={handleInputChangeForGifs}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          ref={inputRef}
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
          
          {/* Button for keyboard GIFs */}
          <button
            onClick={handleKeyboardGifSelect}
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <path d="M21 15L16 10L5 21"></path>
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
