import { createClient } from "@supabase/supabase-js";
import { CATEGORY_PRICES, Membre as BaseMembre } from "../utils/cardHelpers";

// Récupération des variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Création du client Supabase
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

// ✅ Extension du type Membre avec le champ price
export interface Membre extends BaseMembre {
  price: number;
}

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
  insert: async (data: Omit<Membre, "id" | "price"> & { price?: number }) => {
    let price = 0;

    if (typeof CATEGORY_PRICES[data.categorie] === "number") {
      price = CATEGORY_PRICES[data.categorie] as number;
    } else {
      // Si la catégorie est Premium/Diamond/VVIP, on prend la valeur saisie
      price = data.price ?? 0;
    }

    return await supabase
      .from("membres")
      .insert({ ...data, price })
      .select()
      .single();
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
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;

    const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrl.publicUrl;
  },
};