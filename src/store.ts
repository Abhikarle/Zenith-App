import { create } from 'zustand';
import { Task, Category, Priority, UserProfile } from './types';
import { 
  db, 
  auth, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  handleFirestoreError,
  OperationType
} from './firebase';

interface TaskState {
  tasks: Task[];
  categories: Category[];
  user: UserProfile | null;
  searchQuery: string;
  filterPriority: Priority | 'all';
  filterCategory: string | 'all';
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'order';
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: UserProfile | null) => void;
  setTasks: (tasks: Task[]) => void;
  setCategories: (categories: Category[]) => void;
  setSearchQuery: (query: string) => void;
  setFilterPriority: (priority: Priority | 'all') => void;
  setFilterCategory: (categoryId: string | 'all') => void;
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'createdAt' | 'order') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Firebase Actions
  fetchTasks: (userId: string) => () => void;
  syncUser: (user: UserProfile) => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  reorderTasks: (reorderedTasks: Task[]) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  categories: [
    { id: 'work', name: 'Work', color: '#3b82f6' },
    { id: 'personal', name: 'Personal', color: '#10b981' },
    { id: 'shopping', name: 'Shopping', color: '#f59e0b' },
    { id: 'health', name: 'Health', color: '#ef4444' },
  ],
  user: null,
  searchQuery: '',
  filterPriority: 'all',
  filterCategory: 'all',
  sortBy: 'order',
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setTasks: (tasks) => set({ tasks }),
  setCategories: (categories) => set({ categories }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterPriority: (filterPriority) => set({ filterPriority }),
  setFilterCategory: (filterCategory) => set({ filterCategory }),
  setSortBy: (sortBy) => set({ sortBy }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchTasks: (userId) => {
    set({ isLoading: true });
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => doc.data() as Task);
      set({ tasks, isLoading: false });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tasks');
      set({ isLoading: false });
    });

    return unsubscribe;
  },

  syncUser: async (user) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, user, { merge: true });
      set({ user });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  },

  addTask: async (task) => {
    try {
      const taskRef = doc(db, 'tasks', task.id);
      await setDoc(taskRef, task);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `tasks/${task.id}`);
    }
  },

  updateTask: async (id, updates) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, { ...updates, updatedAt: new Date().toISOString() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${id}`);
    }
  },

  deleteTask: async (id) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await deleteDoc(taskRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tasks/${id}`);
    }
  },

  reorderTasks: async (reorderedTasks) => {
    // In a real app, we'd use a batch update for performance
    set({ tasks: reorderedTasks });
    try {
      for (const task of reorderedTasks) {
        const taskRef = doc(db, 'tasks', task.id);
        await updateDoc(taskRef, { order: task.order });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'tasks/reorder');
    }
  },
}));
