import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO string
  category: string;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  budget: number;
}

interface AppState {
  user: User | null;
  expenses: Expense[];
  isAuthenticated: boolean;
  
  // Actions
  login: (name: string, email: string) => void;
  logout: () => void;
  updateProfile: (user: Partial<User>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  editExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
}

// Initial Mock Data
const INITIAL_EXPENSES: Expense[] = [
  { id: '1', description: 'Grocery Shopping', amount: 120.50, date: new Date(2025, 11, 8).toISOString(), category: 'Food' },
  { id: '2', description: 'Netflix Subscription', amount: 15.99, date: new Date(2025, 11, 1).toISOString(), category: 'Entertainment' },
  { id: '3', description: 'Uber Ride', amount: 24.00, date: new Date(2025, 11, 9).toISOString(), category: 'Transport' },
  { id: '4', description: 'Coffee', amount: 5.50, date: new Date(2025, 11, 10).toISOString(), category: 'Food' },
  { id: '5', description: 'Gym Membership', amount: 45.00, date: new Date(2025, 11, 1).toISOString(), category: 'Health' },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      expenses: INITIAL_EXPENSES,
      isAuthenticated: false,

      login: (name, email) => set({ 
        isAuthenticated: true, 
        user: { name, email, budget: 2000 } 
      }),

      logout: () => set({ isAuthenticated: false, user: null }),

      updateProfile: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: uuidv4() }]
      })),

      editExpense: (id, updates) => set((state) => ({
        expenses: state.expenses.map((ex) => ex.id === id ? { ...ex, ...updates } : ex)
      })),

      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((ex) => ex.id !== id)
      })),
    }),
    {
      name: 'm-tracker-storage',
    }
  )
);
