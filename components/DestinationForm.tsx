'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, PRIORITIES } from '@/data/destinations';
import { US_STATES } from '@/data/states';
import { geocode } from '@/lib/geocode';
import type { Destination, Category, Priority } from '@/types';

const STORAGE_KEY = 'roadtrip_added_destinations';

function loadSaved(): Destination[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

const EMPTY_FORM = {
  name: '',
  state: US_STATES[0],
  category: CATEGORIES[0] as Category,
  priority: 'Medium' as Priority,
  note: '',
};

export default function DestinationForm() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setGeocodeError(null); // clear error on any change
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGeocodeError(null);
    setGeocoding(true);

    const coords = await geocode(form.name.trim(), form.state);

    setGeocoding(false);

    if (!coords) {
      setGeocodeError(
        `Could not find "${form.name.trim()}, ${form.state}". ` +
          'Try a more specific place name (e.g. "Grand Canyon South Rim" instead of "Grand Canyon").'
      );
      return;
    }

    const newDestination: Destination = {
      id: `user-${Date.now()}`,
      name: form.name.trim(),
      state: form.state,
      category: form.category,
      priority: form.priority,
      travelers: [],
      note: form.note.trim(),
      lat: coords.lat,
      lng: coords.lng,
    };

    const existing = loadSaved();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...existing, newDestination])
    );

    setSubmittedName(form.name.trim());
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center py-16 flex flex-col items-center gap-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Destination added!
        </h2>
        <p className="text-gray-500">
          <span className="font-medium text-gray-700">{submittedName}</span> is
          on the trip list.
        </p>
        <p className="text-xs text-gray-400">
          Mark who&apos;s interested from the destinations page.
        </p>
        <div className="flex gap-3 mt-2 flex-wrap justify-center">
          <button
            onClick={() => router.push('/destinations')}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View list
          </button>
          <button
            onClick={() => router.push('/map')}
            className="px-5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            View map
          </button>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm(EMPTY_FORM);
            }}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Add another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Place name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Place name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Yellowstone National Park"
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* State dropdown */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="state" className="text-sm font-medium text-gray-700">
          State <span className="text-red-500">*</span>
        </label>
        <select
          id="state"
          name="state"
          required
          value={form.state}
          onChange={handleChange}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {US_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Category & Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="priority"
            className="text-sm font-medium text-gray-700"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Note */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="note" className="text-sm font-medium text-gray-700">
          Note
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          value={form.note}
          onChange={handleChange}
          placeholder="Tips, must-sees, things to book in advance…"
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Geocoding error */}
      {geocodeError && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {geocodeError}
        </div>
      )}

      <button
        type="submit"
        disabled={geocoding}
        className="mt-1 w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {geocoding ? 'Finding location…' : 'Add to trip'}
      </button>
    </form>
  );
}
