import { ref } from 'vue';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/config/supabase';

const user = ref<User | null>(null);
const session = ref<Session | null>(null);
const initialized = ref(false);

/**
 * État d'authentification global (singleton au niveau module), synchronisé avec
 * Supabase Auth. `onAuthStateChange` est enregistré une seule fois, peu importe
 * le nombre de composants qui appellent `useAuth()`.
 */
async function init() {
  if (initialized.value) return;
  initialized.value = true;

  const { data } = await supabase.auth.getSession();
  session.value = data.session;
  user.value = data.session?.user ?? null;

  supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession;
    user.value = newSession?.user ?? null;
  });
}

export function useAuth() {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const signInWithPassword = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      return data;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const signOut = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { user, session, loading, error, init, signInWithPassword, signOut };
}
