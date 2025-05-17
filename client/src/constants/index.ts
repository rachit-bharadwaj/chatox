export const PRODUCTION = import.meta.env.PRODUCTION;

export const HOST = PRODUCTION ? "/" : import.meta.env.VITE_SERVER_URL;

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
