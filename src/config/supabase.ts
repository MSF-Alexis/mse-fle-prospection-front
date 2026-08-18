import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.error(
    '[supabase] VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requis (voir .env.example).',
  );
}

/**
 * Client Supabase unique, réutilisé par toute l'application (Data API + Auth).
 * Utilise la clé "anon" publique : la sécurité est assurée par les policies RLS
 * (voir supabase/policies.sql), pas par le secret de la clé.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
