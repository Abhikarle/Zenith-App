export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  categoryId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  order: number;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    compactMode: boolean;
  };
}
