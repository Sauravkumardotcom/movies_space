/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_ADMIN_EMAIL: string;
  // Add other env vars as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
