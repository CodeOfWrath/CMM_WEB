

import { createClient } from "@supabase/supabase-js";

// Récupération des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ✅ Authentification
export const authService = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({ email, password });
  },

  signInWithPassword: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getUser: async () => {
    return await supabase.auth.getUser();
  },
};

// ✅ Table "membres"
export const membresService = {
  insert: async (data: any) => {
    return await supabase.from("membres").insert(data).select().single();
  },

  selectLast: async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .single();
    return { data, error };
  },
};

// ✅ RPC (fonction SQL)
export const rpcService = {
  getMembersCount: async () => {
    return await supabase.rpc("get_members_count");
  },
};

// ✅ Stockage
export const storageService = {
  uploadImage: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;

    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrl.publicUrl;
  },
};


// ✅ Création du client Supabase
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);