import { ref } from 'vue';
import { apiDelete, apiPost } from '@/services/api';
import type { Note, NoteInput } from '@/types/Note';

export function useNotes() {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const addNote = async (siren: string, input: NoteInput): Promise<Note> => {
    loading.value = true;
    error.value = null;
    try {
      return await apiPost<Note>(`/entreprises/${siren}/notes`, input);
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
      await apiDelete(`/entreprises/${siren}/notes/${noteId}`);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, addNote, deleteNote };
}
