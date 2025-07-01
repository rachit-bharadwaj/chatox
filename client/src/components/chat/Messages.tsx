import { useEffect, useRef, useState } from "react";
import useAppStore from "../../store";
import moment from "moment";
import { Message } from "../../types";
import { apiClient } from "../../utils/apiClient";
import { GET_MESSAGES } from "../../constants";
import { useCrypto } from "../../hooks/useCrypto";

export default function Messages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { selectedChatMessages, selectedChatData, setSelectedChatMessages } =
    useAppStore();
  const { decryptMessage, isMessageEncrypted, decryptSessionKeyFromSender } = useCrypto();
  const [decryptedMessages, setDecryptedMessages] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await apiClient.post(
          GET_MESSAGES,
          {
            receiverId: selectedChatData?._id,
          },
          { withCredentials: true }
        );

        const resData = await res.data;
        console.log(resData);
        setSelectedChatMessages(resData.messages);
      } catch (error) {
        console.log(error);
      }
    };

    if (selectedChatData?._id) {
      fetchMessages();
    }
  }, [selectedChatData?._id, setSelectedChatMessages]);

  // Decrypt messages when they change
  useEffect(() => {
    const decryptMessages = async () => {
      const newDecryptedMessages = new Map(decryptedMessages);
      
      for (const message of selectedChatMessages) {
        if (isMessageEncrypted(message) && !newDecryptedMessages.has(message._id)) {
          try {
            // First, decrypt the session key if we don't have it
            if (message.encryptedSessionKey && message.sessionKeyId) {
              const conversationId = [message.sender, message.receiver].sort().join('-');
              await decryptSessionKeyFromSender(
                message.encryptedSessionKey,
                message.sessionKeyId,
                conversationId
              );
            }

            // Then decrypt the message
            const decrypted = await decryptMessage({
              ciphertext: message.message || '',
              iv: message.iv || '',
              sessionKeyId: message.sessionKeyId || '',
            });

            if (decrypted) {
              newDecryptedMessages.set(message._id, decrypted);
            }
          } catch (error) {
            console.error('Failed to decrypt message:', error);
            newDecryptedMessages.set(message._id, '[Decryption failed]');
          }
        }
      }
      
      setDecryptedMessages(newDecryptedMessages);
    };

    if (selectedChatMessages.length > 0) {
      decryptMessages();
    }
  }, [selectedChatMessages, isMessageEncrypted, decryptMessage, decryptSessionKeyFromSender]);

  const getMessageContent = (message: Message): string => {
    if (isMessageEncrypted(message)) {
      return decryptedMessages.get(message._id) || '[Decrypting...]';
    }
    return message.message || '';
  };

  const renderMessages = () => {
    let lastDate = "";

    return selectedChatMessages.map((message: Message) => {
      console.log("the comparing message is: ", message);
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-gray-500 text-xs text-center mb-1">
              {moment(message.timestamp).format("LL")}
            </div>
          )}

          <div
            className={
              message.sender === selectedChatData?._id
                ? "text-left"
                : "text-right"
            }
          >
            {message.messageType === "text" && (
              <div
                className={`${
                  message.sender !== selectedChatData?._id
                    ? "bg-[#615ef0] text-white text-right"
                    : "bg-white text-black text-left"
                } inline-block shadow rounded-xl break-words p-3 my-0.5`}
              >
                {getMessageContent(message)}
              </div>
            )}
            {message.messageType === "gif" && (
              <div className="inline-block shadow rounded-xl overflow-hidden my-0.5 max-w-xs">
                <img 
                  src={message.message} 
                  alt="GIF" 
                  className="w-full h-auto max-h-64 object-cover"
                />
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  return (
    <section className="h-full p-3 overflow-y-auto">
      {renderMessages()}
      <div ref={scrollRef} />
    </section>
  );
}
