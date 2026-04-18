export type Priority = 'Low' | 'Medium' | 'High';

export type Category =
  | 'National Park'
  | 'City'
  | 'Food'
  | 'Scenic Spot'
  | 'Attraction';

export type DestinationType = 'start' | 'goal' | 'stop';

export interface Destination {
  id: string;
  name: string;
  state: string;
  category: Category;
  priority: Priority;
  travelers: string[];
  note: string | null;
  latitude: number;
  longitude: number;
  type: DestinationType;
  created_at?: string;
}
