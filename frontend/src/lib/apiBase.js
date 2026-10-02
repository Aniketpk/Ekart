// Use the Vite proxy locally; use the verified production API if Vercel's VITE_URL is unset.
const productionApiBase = (import.meta.env.VITE_URL || '').trim() || 'https://ekart-df9t.onrender.com'
export const API_BASE_URL = import.meta.env.DEV ? '' : productionApiBase
