'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, PRIORITIES } from '@/data/destinations';
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

export default function DestinationForm() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    state: '',
    category: CATEGORIES[0] as Category,
    priority: 'Medium' as Priority,
    people: '',
    note: '',
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newDestination: Destination = {
      id: `user-${Date.now()}`,
      name: form.name.trim(),
      state: form.state.trim(),
      category: form.category,
      priority: form.priority,
      people: form.people
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
      note: form.note.trim(),
    };

    const existing = loadSaved();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...existing, newDestination])
    );

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
          <span className="font-medium text-gray-700">{form.name}</span> was
          saved to your trip list.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => router.push('/destinations')}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View all destinations
          </button>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({
                name: '',
                state: '',
                category: CATEGORIES[0],
                priority: 'Medium',
                people: '',
                note: '',
              });
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
        <label
          htmlFor="name"
          className="text-sm font-medium text-gray-700"
        >
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

      {/* State */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="state"
          className="text-sm font-medium text-gray-700"
        >
          State <span className="text-red-500">*</span>
        </label>
        <input
          id="state"
          name="state"
          type="text"
          required
          value={form.state}
          onChange={handleChange}
          placeholder="e.g. Wyoming"
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category & Priority side by side */}
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

      {/* People */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="people"
          className="text-sm font-medium text-gray-700"
        >
          Who wants to go?
        </label>
        <input
          id="people"
          name="people"
          type="text"
          value={form.people}
          onChange={handleChange}
          placeholder="Alice, Bob, Carol (comma-separated)"
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Note */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="note"
          className="text-sm font-medium text-gray-700"
        >
          Note
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          value={form.note}
          onChange={handleChange}
          placeholder="Any tips, links, or things to keep in mind…"
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <button
        type="submit"
        className="mt-1 w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
      >
        Add to trip
      </button>
    </form>
  );
}
