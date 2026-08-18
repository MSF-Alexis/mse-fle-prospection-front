import { ref } from 'vue';
import { supabase } from '@/config/supabase';
import type { Contact, ContactInput } from '@/types/Contact';

function mapContactRow(row: any): Contact {
  return {
    id: row.id,
    nom: row.nom,
    prenom: row.prenom ?? undefined,
    poste: row.poste ?? undefined,
    email: row.email ?? undefined,
    telephone: row.telephone ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function useContacts() {
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const addContact = async (siren: string, input: ContactInput): Promise<Contact> => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: insertError } = await supabase
        .from('contacts')
        .insert({ entreprise_siren: siren, ...input })
        .select()
        .single();
      if (insertError) throw insertError;
      await touchEntreprise(siren);
      return mapContactRow(data);
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
      const { data, error: updateError } = await supabase
        .from('contacts')
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq('id', contactId)
        .eq('entreprise_siren', siren)
        .select()
        .single();
      if (updateError) throw updateError;
      await touchEntreprise(siren);
      return mapContactRow(data);
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
      const { error: deleteError } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId)
        .eq('entreprise_siren', siren);
      if (deleteError) throw deleteError;
      await touchEntreprise(siren);
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, addContact, updateContact, deleteContact };
}

async function touchEntreprise(siren: string): Promise<void> {
  await supabase.from('entreprises').update({ updated_at: new Date().toISOString() }).eq('siren', siren);
}
