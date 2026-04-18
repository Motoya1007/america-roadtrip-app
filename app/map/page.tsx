'use client';

// ssr: false is only allowed inside Client Components (Next.js 16 requirement)
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase/client';
import type { Destination } from '@/types';

// Leaflet manipulates the DOM directly — disable SSR to avoid hydration errors
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
      Loading map…
    </div>
  ),
});

export default function MapPage() {
  const [destinations, setDestinations] = useState<Destination[] | null>(null);

  useEffect(() => {
    async function fetchDestinations() {
      const { data } = await getSupabase()
        .from('destinations')
        .select('*')
        .order('created_at', { ascending: true });
      if (data) setDestinations(data as Destination[]);
    }

    fetchDestinations();
    const id = setInterval(fetchDestinations, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <header className="shrink-0 bg-white border-b border-gray-200">
        {/* Title row */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-14">
          <div className="flex items-center gap-3">
            <span className="text-xl">🗺️</span>
            <h1 className="text-base font-semibold text-gray-900">Trip Map</h1>
            {destinations != null && (
              <span className="text-xs text-gray-400">
                {destinations.length} pin{destinations.length !== 1 ? 's' : ''}
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
        </div>

        {/* Route legend */}
        <div className="flex items-center gap-4 px-4 sm:px-6 pb-2.5 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-600 text-white text-[9px] font-bold shrink-0">
              S
            </span>
            <span className="text-gray-600">
              Start: <span className="font-semibold text-gray-800">San Francisco</span>
            </span>
          </div>
          <span className="text-gray-300">→</span>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-[9px] font-bold shrink-0">
              G
            </span>
            <span className="text-gray-600">
              Goal: <span className="font-semibold text-gray-800">New York</span>
            </span>
          </div>
          <span className="text-gray-300 mx-1">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-base leading-none">📍</span>
            <span className="text-gray-500">Destination</span>
          </div>
        </div>
      </header>

      {/* Map area — fills remaining height */}
      <main className="flex-1 relative overflow-hidden">
        {destinations === null ? (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Loading…
          </div>
        ) : destinations.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-400">
            <span className="text-4xl">📍</span>
            <p className="text-sm">No destinations yet.</p>
            <Link href="/add" className="text-blue-600 text-sm hover:underline">
              Add a place →
            </Link>
          </div>
        ) : (
          <MapView destinations={destinations} />
        )}
      </main>
    </div>
  );
}
