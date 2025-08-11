// Debug logging to help identify the issue
console.log('Constants file loading...');
console.log('MODE:', import.meta.env.MODE);
console.log('VITE_SERVER_URL:', import.meta.env.VITE_SERVER_URL);
console.log('PRODUCTION:', import.meta.env.MODE === "production");

export const PRODUCTION = import.meta.env.MODE === "production";

// In production, use relative URLs (empty string for same origin)
// In development, use the VITE_SERVER_URL or fallback to localhost
// Make sure to handle undefined VITE_SERVER_URL gracefully
const serverUrl = import.meta.env.VITE_SERVER_URL;
export const HOST = PRODUCTION ? "" : (serverUrl || "http://localhost:5000");

console.log('HOST resolved to:', HOST);

// routes
export const AUTH_ROUTES = `${HOST}/api/auth`;
export const REGISTER_ROUTE = `${AUTH_ROUTES}/register`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/getUserInfo`;

export const CONTACT_ROUTES = `${HOST}/api/contact`;
export const SEARCH_ROUTE = `${CONTACT_ROUTES}/search`;
export const GET_CONTACTS = `${CONTACT_ROUTES}/get-contacts`;

export const CHAT_ROUTES = `${HOST}/api/chat`;
export const GET_MESSAGES = `${CHAT_ROUTES}/messages`;

export const USER_ROUTES = `${HOST}/api/user`;
export const FETCH_BY_USERNAME = `${USER_ROUTES}/fetchByUserName`;
export const EDIT_PROFILE = `${USER_ROUTES}/editProfile`;
export const CHECK_USERNAME = `${USER_ROUTES}/checkUsername`;
export const CHECK_EMAIL = `${USER_ROUTES}/checkEmail`;
