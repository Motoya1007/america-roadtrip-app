export const TRAVELERS = ['Yujiro', 'Natsuki', 'Hirohito', 'Motoya'] as const;

export type Traveler = (typeof TRAVELERS)[number];

// Consistent color per person — used on cards and the home page
export const TRAVELER_COLORS: Record<Traveler, string> = {
  Yujiro: 'bg-violet-100 text-violet-700',
  Natsuki: 'bg-pink-100 text-pink-700',
  Hirohito: 'bg-blue-100 text-blue-700',
  Motoya: 'bg-emerald-100 text-emerald-700',
};
