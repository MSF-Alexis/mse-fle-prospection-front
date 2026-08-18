import { ref } from 'vue';

export interface AppConfig {
  ref_lat: number;
  ref_lon: number;
}

const DEFAULT_REF_LAT = 48.8566;
const DEFAULT_REF_LON = 2.3522;

const config = ref<AppConfig | null>(null);
const loading = ref(false);

export function useConfig() {
  const fetchConfig = async (): Promise<AppConfig> => {
    if (config.value) return config.value;

    loading.value = true;
    try {
      const ref_lat = Number(import.meta.env.VITE_REF_LAT ?? DEFAULT_REF_LAT);
      const ref_lon = Number(import.meta.env.VITE_REF_LON ?? DEFAULT_REF_LON);
      config.value = { ref_lat, ref_lon };
      return config.value;
    } finally {
      loading.value = false;
    }
  };

  return { config, loading, fetchConfig };
}
