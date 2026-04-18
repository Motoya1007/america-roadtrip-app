import type { Destination, Priority } from '@/types';

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
}

export default function DestinationCard({ destination }: Props) {
  const { name, state, category, priority, people, note } = destination;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
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

      {/* People */}
      {people.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto pt-1 border-t border-gray-100">
          {people.map((person) => (
            <span
              key={person}
              className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
            >
              {person}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
