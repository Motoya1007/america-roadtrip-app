export type Priority = 'Low' | 'Medium' | 'High';

export type Category =
  | 'National Park'
  | 'City'
  | 'Food'
  | 'Scenic Spot'
  | 'Attraction';

export interface Destination {
  id: string;
  name: string;
  state: string;
  category: Category;
  priority: Priority;
  people: string[];
  note: string;
}
