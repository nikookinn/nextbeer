/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_API_RETRY_ATTEMPTS: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: string
  readonly VITE_ENABLE_DEVTOOLS: string
  readonly VITE_ENABLE_CONSOLE_LOGS: string
  readonly VITE_ENABLE_DEBUG: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_ERROR_REPORTING: string
  readonly VITE_CACHE_DURATION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
