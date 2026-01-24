// vite-env.d.ts
// Créez ce fichier à la racine de votre dossier src/

/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Supabase
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  
  // App Configuration
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_URL?: string
  
  // Mode et autres variables Vite par défaut
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}