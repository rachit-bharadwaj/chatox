import { ChangeEvent, useEffect, useRef, useState } from "react";

// locals
import { Contact } from "../../types";
import { GET_CONTACTS, SEARCH_ROUTE } from "../../constants";
import { apiClient } from "../../utils/apiClient";
import useAppStore from "../../store";

// icons
import { TiUser } from "react-icons/ti";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { ImCross } from "react-icons/im";
import moment from "moment";

export default function ChatList() {
  const { setSelectedChatData, selectedChatData } = useAppStore();

  const [searchDropDown, setSearchDropDown] = useState(false);
  const [searchList, setSearchList] = useState<Contact[]>([]);
  const [searchResLoading, setSearchResLoading] = useState(false);

  const [contactList, setContactList] = useState<Contact[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleContactSearch = async (searchTerm: string) => {
    try {
      setSearchDropDown(true);
      setSearchResLoading(true);

      if (searchTerm.length > 0) {
        const res = await apiClient.post(
          SEARCH_ROUTE,
          { searchTerm },
          { withCredentials: true }
        );
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

  const selectContact = (contact: Contact) => {
    setSearchDropDown(false);
    setSearchList([]);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setSelectedChatData(contact);
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await apiClient.get(GET_CONTACTS, {
          withCredentials: true,
        });
        const resData = await res.data;
        console.log(resData);
        setContactList(resData.contacts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchContacts();
  }, []);

  const formatLastMessageTime = (timestamp: string) => {
    const now = moment();
    const messageTime = moment(timestamp);

    if (now.isSame(messageTime, "day")) {
      // If the message was sent today
      return messageTime.format("h:mm A");
    } else if (now.subtract(1, "days").isSame(messageTime, "day")) {
      // If the message was sent yesterday
      return `Yesterday, ${messageTime.format("h:mm A")}`;
    } else {
      // If the message was sent earlier
      return messageTime.format("MMM D, h:mm A");
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
              className="flex p-3 border-b items-center gap-3 cursor-pointer hover:bg-gray-50"
              onClick={() => selectContact(contact)}
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
          {contactList.map((contact: Contact) => (
            <div
              key={contact._id}
              className={`flex justify-between p-3 border-b items-center cursor-pointer hover:bg-gray-50 ${
                selectedChatData?._id === contact._id && "bg-gray-50"
              }`}
              onClick={() => setSelectedChatData(contact)}
            >
              <div className="flex gap-3 items-center">
                <TiUser className="text-4xl shrink-0" />

                <div>
                  <p className="text-lg">{contact.name}</p>
                  <p>{contact.lastMessage}</p>
                </div>
              </div>

              <p>{formatLastMessageTime(contact.lastMessageTime)}</p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
