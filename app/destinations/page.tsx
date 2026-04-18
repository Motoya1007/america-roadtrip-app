'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { initialDestinations, CATEGORIES } from '@/data/destinations';
import DestinationCard from '@/components/DestinationCard';
import type { Destination, Category, Priority } from '@/types';

const STORAGE_KEY = 'roadtrip_added_destinations';

const PRIORITY_ORDER: Record<Priority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

function loadSaved(): Destination[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export default function DestinationsPage() {
  const [allDestinations, setAllDestinations] =
    useState<Destination[]>(initialDestinations);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'priority' | 'name'>('priority');

  // Merge localStorage additions on mount
  useEffect(() => {
    const saved = loadSaved();
    if (saved.length > 0) {
      setAllDestinations([...initialDestinations, ...saved]);
    }
  }, []);

  function handleDelete(id: string) {
    setAllDestinations((prev) => prev.filter((d) => d.id !== id));
  }

  const filtered = useMemo(() => {
    let list = allDestinations;

    if (categoryFilter !== 'All') {
      list = list.filter((d) => d.category === categoryFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.state.toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (sortOrder === 'priority') {
        return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      }
      return a.name.localeCompare(b.name);
    });
  }, [allDestinations, categoryFilter, search, sortOrder]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {filtered.length} place{filtered.length !== 1 ? 's' : ''} on your
            list
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add place
          </Link>
          <Link
            href="/map"
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            🗺️ Map
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or state…"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as Category | 'All')
          }
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'priority' | 'name')}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="priority">Sort by priority</option>
          <option value="name">Sort by name</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🗺️</p>
          <p className="text-sm">No destinations match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
