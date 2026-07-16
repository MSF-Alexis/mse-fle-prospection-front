import { ref } from 'vue';
import { apiDelete, apiPost, apiPut } from '@/services/api';
import type { Contact, ContactInput } from '@/types/Contact';

export function useContacts() {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const addContact = async (siren: string, input: ContactInput): Promise<Contact> => {
    loading.value = true;
    error.value = null;
    try {
      return await apiPost<Contact>(`/entreprises/${siren}/contacts`, input);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateContact = async (
    siren: string,
    contactId: string,
    input: Partial<ContactInput>,
  ): Promise<Contact> => {
    loading.value = true;
    error.value = null;
    try {
      return await apiPut<Contact>(`/entreprises/${siren}/contacts/${contactId}`, input);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteContact = async (siren: string, contactId: string): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      await apiDelete(`/entreprises/${siren}/contacts/${contactId}`);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, addContact, updateContact, deleteContact };
}
