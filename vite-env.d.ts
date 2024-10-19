/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  // 다른 환경 변수를 여기 추가하세요.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
