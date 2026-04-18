export interface Coords {
  lat: number;
  lng: number;
}

/**
 * Look up coordinates for a place using the free Nominatim API.
 * No API key required. Called once on form submission only.
 */
export async function geocode(
  placeName: string,
  state: string
): Promise<Coords | null> {
  try {
    const q = encodeURIComponent(`${placeName}, ${state}, USA`);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
      {
        headers: {
          // Nominatim requests a descriptive header per their usage policy
          'Accept-Language': 'en',
        },
      }
    );

    if (!res.ok) return null;

    const data: Array<{ lat: string; lon: string }> = await res.json();
    if (!data.length) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon), // Nominatim returns "lon", we normalize to "lng"
    };
  } catch {
    return null;
  }
}
