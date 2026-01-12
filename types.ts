export enum Category {
  PERSONAL = 'Persoonlijk',
  WORK = 'Werk',
  HEALTH = 'Gezondheid',
  FINANCE = 'Financiën',
  LEARNING = 'Leren'
}

export interface Goal {
  id: string;
  title: string;
  category: Category;
  completed: boolean;
  createdAt: number;
}

export interface Source {
  title: string;
  uri: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: Source[];
}

export type ChatMode = 'STANDARD' | 'RESEARCH' | 'THINKING';

export type FilterType = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CHAT' | Category;