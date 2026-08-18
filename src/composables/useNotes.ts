import { ref } from 'vue';
import { supabase } from '@/config/supabase';
import type { Note, NoteInput } from '@/types/Note';

function mapNoteRow(row: any): Note {
  return {
    id: row.id,
    auteur: row.auteur ?? undefined,
    contenu: row.contenu,
    statut: row.statut ?? undefined,
    createdAt: row.created_at,
  };
}

export function useNotes() {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const addNote = async (siren: string, input: NoteInput): Promise<Note> => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: insertError } = await supabase
        .from('notes')
        .insert({ entreprise_siren: siren, ...input })
        .select()
        .single();
      if (insertError) throw insertError;

      if (input.statut) {
        await supabase
          .from('entreprises')
          .update({ statut_prospection: input.statut, updated_at: new Date().toISOString() })
          .eq('siren', siren);
      }

      return mapNoteRow(data);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteNote = async (siren: string, noteId: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('entreprise_siren', siren);
      if (deleteError) throw deleteError;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, addNote, deleteNote };
}
