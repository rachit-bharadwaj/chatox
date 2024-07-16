import { ChangeEvent, useRef, useState } from "react";

// locals
import { User } from "../../types";
import { dummyChatPreviews, SEARCH_ROUTE } from "../../constants";
import { apiClient } from "../../utils/apiClient";

// icons
import { TiUser } from "react-icons/ti";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { ImCross } from "react-icons/im";

export default function ChatList() {
  // const [chats, setChats] = useState<ChatPreview[]>()

  const [searchDropDown, setSearchDropDown] = useState(false);
  const [searchList, setSearchList] = useState<User[]>([]);
  const [searchResLoading, setSearchResLoading] = useState(false);
  // const [chatListLoading, setChatListLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleContactSearch = async (searchTerm: string) => {
    try {
      setSearchDropDown(true);
      setSearchResLoading(true);

      if (searchTerm.length > 0) {
        console.log(searchTerm);
        const res = await apiClient.post(
          SEARCH_ROUTE,
          { searchTerm },
          { withCredentials: true }
        );
        console.log(res.data);
        const resData = await res.data;

        setSearchList(resData.contacts);
      }
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setSearchResLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchDropDown(false);
    setSearchList([]);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  };

  return (
    <aside>
      <header className="p-3 py-5 border-b">
        <h1 className="text-3xl font-extrabold text-[#615ef0]">Chatox</h1>
      </header>

      {/* search bar */}
      <div className="m-3 py-2 px-3 border rounded-lg flex gap-2 items-center">
        <HiMiniMagnifyingGlass className="text-2xl text-gray-400 shrink-0" />
        <input
          id="contact-search"
          type="text"
          placeholder="Search chats"
          className="w-full outline-none"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            handleContactSearch(e.target.value);
          }}
          ref={searchInputRef}
        />
        {searchDropDown && (
          <button className="group" onClick={clearSearch}>
            <ImCross className="text-xl text-gray-400 shrink-0 group-hover:text-red-500" />
          </button>
        )}
      </div>

      {searchDropDown ? (
        <>
          {searchResLoading && <div>Loading...</div>}
          {searchList?.map((contact) => (
            <div
              key={contact._id}
              className="flex p-3 border-b items-center gap-3"
            >
              <div>
                {contact.profilePicture ? (
                  <img
                    src={contact.profilePicture}
                    alt={contact.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="rounded-full border p-2">
                    <TiUser className="h-10 w-10 text-gray-500" />
                  </div>
                )}
              </div>

              <div>
                <p className="text-lg">{contact.name}</p>
                <p className="text-gray-500 text-sm">@{contact.userName}</p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div>
          {dummyChatPreviews.map((chat) => (
            <div
              key={chat.id}
              className="flex justify-between p-3 border-b items-center"
            >
              <div className="flex gap-3 items-center">
                <TiUser className="text-4xl" />

                <div>
                  <p className="text-lg">{chat.name}</p>
                  <p>{chat.lastMessage}</p>
                </div>
              </div>

              <p>{chat.lastMessageTime}</p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
