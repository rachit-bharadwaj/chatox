import useAppStore from "../../store";

// icons
import { TiUser } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { Link } from "react-router-dom";

export default function ChatScreenHeader() {
  const { selectedChatData, closeChat } = useAppStore();

  return (
    <header className="flex sticky top-0 text-gray-900 justify-between items-center border-b p-3 bg-white">
      <Link
        to={`/${selectedChatData?.userName}`}
        className="flex gap-10 items-center"
      >
        <div className="w-fit">
          {selectedChatData?.profilePicture ? (
            <img
              src={selectedChatData?.profilePicture}
              alt={selectedChatData?.name}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="rounded-full border p-3">
              <TiUser className="h-7 w-7 text-gray-500" />
            </div>
          )}
        </div>

        <p className="text-lg">{selectedChatData?.name}</p>
      </Link>

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
