/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_TENANT_ID: string
  readonly VITE_AZURE_CLIENT_ID: string
  readonly VITE_AZURE_CLIENT_SECRET: string
  readonly VITE_DIRECTLINE_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
