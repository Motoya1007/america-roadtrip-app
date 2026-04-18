import Link from 'next/link';
import { TRAVELERS, TRAVELER_COLORS } from '@/data/travelers';
import type { Traveler } from '@/data/travelers';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
      <div className="max-w-lg w-full flex flex-col items-center gap-6">
        {/* Icon + title */}
        <div className="text-6xl">🚗</div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          RoadTrip Planner Lite
        </h1>

        {/* Route subtitle */}
        <div className="flex items-center gap-2 text-xl font-semibold text-gray-600">
          <span>San Francisco</span>
          <span className="text-gray-300">→</span>
          <span>New York</span>
        </div>

        <p className="text-base text-gray-500 leading-relaxed -mt-2">
          Track every stop, mark priorities, and see it all on a map.
        </p>

        {/* Travelers */}
        <div className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 flex flex-col items-center gap-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Travelers
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {TRAVELERS.map((name) => (
              <span
                key={name}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${TRAVELER_COLORS[name as Traveler]}`}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          <Link
            href="/destinations"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            View destinations
          </Link>
          <Link
            href="/map"
            className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            🗺️ View map
          </Link>
          <Link
            href="/add"
            className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            + Add a place
          </Link>
        </div>
      </div>
    </main>
  );
}
