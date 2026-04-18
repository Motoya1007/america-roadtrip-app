'use client';

import type { Destination, Priority } from '@/types';
import { TRAVELERS, TRAVELER_COLORS } from '@/data/travelers';
import type { Traveler } from '@/data/travelers';

const priorityStyles: Record<Priority, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

const categoryEmoji: Record<string, string> = {
  'National Park': '🏔️',
  City: '🏙️',
  Food: '🍽️',
  'Scenic Spot': '🌅',
  Attraction: '🎡',
};

interface Props {
  destination: Destination;
  onDelete: (id: string) => void;
  onToggleTraveler: (destinationId: string, traveler: string) => void;
}

export default function DestinationCard({
  destination,
  onDelete,
  onToggleTraveler,
}: Props) {
  const { id, name, state, category, priority, note } = destination;
  const travelers: string[] = destination.travelers ?? [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 leading-tight">
            {categoryEmoji[category] ?? '📍'} {name}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{state}</p>
        </div>
        <span
          className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${priorityStyles[priority]}`}
        >
          {priority}
        </span>
      </div>

      {/* Category */}
      <span className="inline-block w-fit text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
        {category}
      </span>

      {/* Note */}
      {note && <p className="text-sm text-gray-600 leading-relaxed">{note}</p>}

      {/* Traveler toggles */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Interested
        </span>
        <div className="flex flex-wrap gap-1.5">
          {TRAVELERS.map((traveler) => {
            const selected = travelers.includes(traveler);
            return (
              <button
                key={traveler}
                type="button"
                onClick={() => onToggleTraveler(id, traveler)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selected
                    ? TRAVELER_COLORS[traveler as Traveler]
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {traveler}
              </button>
            );
          })}
        </div>
      </div>

      {/* Delete */}
      <div className="flex justify-end">
        <button
          onClick={() => onDelete(id)}
          aria-label={`Delete ${name}`}
          className="text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
