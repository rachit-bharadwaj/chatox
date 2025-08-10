/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string;
  readonly PRODUCTION: boolean;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
