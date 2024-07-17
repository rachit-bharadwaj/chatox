import { useEffect, useRef } from "react";
import useAppStore from "../../store";
import moment from "moment";
import { Message } from "../../types";
import { apiClient } from "../../utils/apiClient";
import { GET_MESSAGES } from "../../constants";

export default function Messages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { selectedChatMessages, selectedChatData, setSelectedChatMessages } =
    useAppStore();

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
                ? "flex justify-end"
                : "text-left"
            }
          >
            {message.messageType === "text" && (
              <div
                className={`${
                  message.sender !== selectedChatData?._id
                    ? "bg-indigo-500 text-white text-right"
                    : "bg-white text-black text-left"
                } border inline-block rounded-lg break-words p-3`}
              >
                {message.message}
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
    <section className="h-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </section>
  );
}
