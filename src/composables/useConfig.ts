import { ref } from 'vue';
import { apiGet } from '@/services/api';

export interface AppConfig {
  ref_lat: number;
  ref_lon: number;
}

// Le point de référence par défaut change rarement : on le met en cache au
// niveau module pour éviter de le refetch à chaque montage de composant.
const config = ref<AppConfig | null>(null);
const loading = ref(false);

export function useConfig() {
  const fetchConfig = async (): Promise<AppConfig> => {
    if (config.value) return config.value;

    loading.value = true;
    try {
      config.value = await apiGet<AppConfig>('/config');
      return config.value;
    } finally {
      loading.value = false;
    }
  };

  return { config, loading, fetchConfig };
}
