'use client';

// ssr: false is only allowed inside Client Components (Next.js 16 requirement)
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { initialDestinations } from '@/data/destinations';
import type { Destination } from '@/types';

const STORAGE_KEY = 'roadtrip_added_destinations';

// Leaflet manipulates the DOM directly — disable SSR to avoid hydration errors
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
      Loading map…
    </div>
  ),
});

function loadSaved(): Destination[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export default function MapPage() {
  // null = not yet loaded (avoids rendering MapView before localStorage is read)
  const [destinations, setDestinations] = useState<Destination[] | null>(null);

  useEffect(() => {
    const saved = loadSaved();
    setDestinations(
      saved.length > 0
        ? [...initialDestinations, ...saved]
        : initialDestinations
    );
  }, []);

  const mapped = destinations?.filter(
    (d) => d.lat != null && d.lng != null
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 h-14 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-xl">🗺️</span>
          <h1 className="text-base font-semibold text-gray-900">Trip Map</h1>
          {mapped != null && (
            <span className="text-xs text-gray-400">
              {mapped.length} pin{mapped.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href="/add"
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add place
          </Link>
          <Link
            href="/destinations"
            className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            List view
          </Link>
        </div>
      </header>

      {/* Map area — fills remaining height */}
      <main className="flex-1 relative overflow-hidden">
        {destinations === null ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Loading…
          </div>
        ) : mapped!.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-400">
            <span className="text-4xl">📍</span>
            <p className="text-sm">No destinations with coordinates yet.</p>
            <Link
              href="/add"
              className="text-blue-600 text-sm hover:underline"
            >
              Add a place with lat / lng →
            </Link>
          </div>
        ) : (
          <MapView destinations={mapped!} />
        )}
      </main>
    </div>
  );
}
