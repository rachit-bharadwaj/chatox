export const HOST = import.meta.env.VITE_SERVER_URL;

// routes
export const AUTH_ROUTES = "api/auth";

export const REGISTER_ROUTE = `${AUTH_ROUTES}/register`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/getUserInfo`;

export const CONTACT_ROUTES = "api/contact";
export const SEARCH_ROUTE = `${CONTACT_ROUTES}/search`;
export const GET_CONTACTS = `${CONTACT_ROUTES}/get-contacts`;

export const CHAT_ROUTES = "api/chat";
export const GET_MESSAGES = `${CHAT_ROUTES}/messages`;

export const dummyChatPreviews = [
  {
    id: 1,
    name: "Rachit",
    lastMessage: "Hello",
    lastMessageTime: "10:00",
  },
  {
    id: 2,
    name: "Rachit",
    lastMessage: "Hello",
    lastMessageTime: "10:00",
  },
  {
    id: 3,
    name: "Rachit",
    lastMessage: "Hello",
    lastMessageTime: "10:00",
  },
];
