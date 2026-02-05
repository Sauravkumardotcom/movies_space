/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ENV: string;
  readonly VITE_FEATURE_OFFLINE_MODE: string;
  readonly VITE_FEATURE_UPLOADS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
