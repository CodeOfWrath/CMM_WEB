export const env = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Member Card Management',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173'
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
}

// Validation
if (!env.supabase.url || !env.supabase.anonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  )
}