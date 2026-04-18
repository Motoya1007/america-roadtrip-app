import Link from 'next/link';
import { TRAVELERS, TRAVELER_COLORS } from '@/data/travelers';
import type { Traveler } from '@/data/travelers';

const STOPS = [
  { city: 'San Francisco', state: 'CA', emoji: '🌉' },
  { city: 'Yosemite', state: 'CA', emoji: '🏔️' },
  { city: 'Las Vegas', state: 'NV', emoji: '🎰' },
  { city: 'Grand Canyon', state: 'AZ', emoji: '🏜️' },
  { city: 'Zion', state: 'UT', emoji: '🪨' },
  { city: 'Rocky Mtn', state: 'CO', emoji: '⛰️' },
  { city: 'Chicago', state: 'IL', emoji: '🍕' },
  { city: 'Nashville', state: 'TN', emoji: '🎸' },
  { city: 'D.C.', state: 'DC', emoji: '🏛️' },
  { city: 'New York', state: 'NY', emoji: '🗽' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-sky-50 via-white to-white">

      {/* Hero */}
      <section className="w-full max-w-2xl px-6 pt-16 pb-10 flex flex-col items-center text-center gap-4">
        <div className="flex items-center gap-3 text-5xl">
          <span>🌉</span>
          <span className="text-3xl text-gray-300 font-light">—</span>
          <span>🚗</span>
          <span className="text-3xl text-gray-300 font-light">—</span>
          <span>🗽</span>
        </div>

        <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-full">
          <span>🎓</span> Graduation Trip 2026
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Coast to Coast
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          San Francisco → New York
        </p>
        <p className="text-sm text-gray-400 max-w-sm">
          卒業を祝って、4人でアメリカ横断。
        </p>
      </section>

      {/* Route strip */}
      <section className="w-full overflow-x-auto py-4 px-4">
        <div className="flex items-center gap-0 mx-auto w-max px-4">
          {STOPS.map((stop, i) => (
            <div key={stop.city} className="flex items-center">
              <div className="flex flex-col items-center gap-1 w-16 sm:w-20">
                <span className="text-xl">{stop.emoji}</span>
                <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">
                  {stop.city}
                </span>
                <span className="text-[9px] text-gray-400">{stop.state}</span>
              </div>
              {i < STOPS.length - 1 && (
                <div className="flex items-center mx-0.5 mb-4">
                  <div className="w-3 h-px bg-gray-300" />
                  <span className="text-gray-300 text-xs">›</span>
                  <div className="w-3 h-px bg-gray-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Travelers */}
      <section className="w-full max-w-sm mx-auto px-6 mt-4">
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 shadow-sm flex flex-col items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Who&apos;s going
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
      </section>

      {/* CTAs */}
      <section className="w-full max-w-sm mx-auto px-6 mt-6 pb-16 flex flex-col gap-3">
        <Link
          href="/destinations"
          className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-sm text-center hover:bg-blue-700 transition-colors shadow-sm"
        >
          View all destinations
        </Link>
        <div className="flex gap-3">
          <Link
            href="/map"
            className="flex-1 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-sm text-center hover:bg-gray-50 transition-colors"
          >
            🗺️ Map
          </Link>
          <Link
            href="/add"
            className="flex-1 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-sm text-center hover:bg-gray-50 transition-colors"
          >
            + Add place
          </Link>
        </div>
      </section>

    </main>
  );
}
