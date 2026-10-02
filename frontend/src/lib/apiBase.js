// Use the Vite same-origin proxy during local development to avoid browser CORS failures.
export const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_URL || '').trim()
