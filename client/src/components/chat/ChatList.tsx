import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { TiUser } from "react-icons/ti";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { ImCross } from "react-icons/im";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Contact } from "../../types";
import { GET_CONTACTS, SEARCH_ROUTE } from "../../constants";
import { apiClient } from "../../utils/apiClient";
import useAppStore from "../../store";

import Cookies from "js-cookie";

export default function ChatList() {
  const { setSelectedChatData, selectedChatData, userData } = useAppStore();
  const [searchDropDown, setSearchDropDown] = useState(false);
  const [searchList, setSearchList] = useState<Contact[]>([]);
  const [searchResLoading, setSearchResLoading] = useState(false);
  const [contactList, setContactList] = useState<Contact[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleContactSearch = async (searchTerm: string) => {
    try {
      setSearchDropDown(true);
      setSearchResLoading(true);

      if (searchTerm.length === 0) {
        setSearchList([]);
        setSearchDropDown(false);
        setSearchResLoading(false);
        return;
      }

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchList.length > 0) {
        selectContact(searchList[0]);
      }
      searchInputRef.current?.blur();
    }
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await apiClient.get(GET_CONTACTS, {
          withCredentials: true,
        });
        const resData = await res.data;

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

    const minutesAgo = now.diff(messageTime, "minutes");
    const hoursAgo = now.diff(messageTime, "hours");
    const daysAgo = now.diff(messageTime, "days");

    if (minutesAgo < 60) {
      return `${minutesAgo}m`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo}h`;
    } else {
      return `${daysAgo}d`;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    window.location.reload();
  };

  return (
    <aside>
      <header className="p-3 border-b flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-[#615ef0]">
          <Link to="/">Chatox</Link>
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            {userData?.profilePicture ? (
              <img
                src={userData?.profilePicture}
                alt={userData?.name}
                className="w-7 h-7 rounded-full"
              />
            ) : (
              <div className="rounded-full border p-2">
                <TiUser className="h-7 w-7 text-gray-500" />
              </div>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link to={`/${userData?.userName}`} className="w-full text-left">
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link to="/settings" className="w-full text-left">
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button className="w-full text-left" onClick={logout}>
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* search bar */}
      <div className="m-3 px-3 py-4 rounded-xl flex gap-2 text-[#929292] items-center bg-[#f3f3f3]">
        <HiMiniMagnifyingGlass className="text-2xl shrink-0" />
        <input
          id="contact-search"
          type="text"
          placeholder="Search contacts"
          className="w-full outline-none bg-transparent"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleContactSearch(e.target.value)}
          onKeyDown={handleKeyDown}
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
              className={`flex justify-between p-3 my-5 items-center cursor-pointer hover:bg-gray-50 rounded-xl mx-3 ${
                selectedChatData?._id === contact._id && "bg-[#f6f6fe]"
              }`}
              onClick={() => setSelectedChatData(contact)}
            >
              <div className="flex gap-3 items-center">
                {contact.profilePicture ? (
                  <img
                    src={contact.profilePicture}
                    alt={contact.name}
                    className="w-10 h-10 rounded-xl"
                  />
                ) : (
                  <TiUser className="text-4xl shrink-0" />
                )}

                <div>
                  <p className="text-lg">{contact.name}</p>
                  <p className="text-[#999999]">{contact.lastMessage}</p>
                </div>
              </div>

              <p className="text-[#999999]">
                {formatLastMessageTime(contact.lastMessageTime)}
              </p>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
