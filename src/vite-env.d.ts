/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_QUOTE_TOOL_URL?: string;
  /** Meta (Facebook) Pixel id, e.g. 123456789012345. Unset = pixel disabled. */
  readonly VITE_FACEBOOK_PIXEL_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
