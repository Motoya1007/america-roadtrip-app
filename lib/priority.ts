import type { Priority } from '@/types';

export function getPriorityFromTravelers(travelers: string[]): Priority {
  if (travelers.length >= 4) return 'High';
  if (travelers.length >= 2) return 'Medium';
  return 'Low';
}
