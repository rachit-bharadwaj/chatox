import useAppStore from "../../store";

// icons
import { TiUser } from "react-icons/ti";
import { ImCross } from "react-icons/im";

export default function ChatScreenHeader() {
  const { selectedChatData, closeChat } = useAppStore();

  return (
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
  );
}
