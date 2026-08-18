const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const km = EARTH_RADIUS_KM * c;
  return Math.round(km * 100) / 100;
}

export function getEntrepriseCoords(entreprise: {
  latitude?: number | null;
  longitude?: number | null;
}): { lat: number; lon: number } | null {
  const lat = entreprise.latitude;
  const lon = entreprise.longitude;
  if (lat === null || lat === undefined || lon === null || lon === undefined) return null;
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return { lat, lon };
}
