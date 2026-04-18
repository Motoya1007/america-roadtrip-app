import Link from 'next/link';

const HIGHLIGHTS = [
  { emoji: '📍', label: '10 sample destinations' },
  { emoji: '🔍', label: 'Filter, sort & search' },
  { emoji: '➕', label: 'Add your own spots' },
  { emoji: '🗺️', label: 'Interactive map view' },
];

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
      <div className="max-w-lg w-full flex flex-col items-center gap-6">
        <div className="text-6xl">🚗</div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          RoadTrip Planner Lite
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed">
          Plan your cross-country US road trip with friends. Add places you
          want to visit, set priorities, and see them all on a map.
        </p>

        {/* Feature chips */}
        <ul className="flex flex-wrap justify-center gap-3 mt-2">
          {HIGHLIGHTS.map(({ emoji, label }) => (
            <li
              key={label}
              className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 shadow-sm"
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3 mt-4">
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
