'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, Role, Category, TransactionType } from './types';
import { INITIAL_TRANSACTIONS } from './mock-data';

interface FilterState {
  search: string;
  category: Category | 'All';
  type: TransactionType | 'All';
  startDate: string;
  endDate: string;
}

interface FinanceState {
  transactions: Transaction[];
  role: Role;
  isSidebarOpen: boolean;
  filter: FilterState;
  editingTransaction: Transaction | null;
  isLoading: boolean;
  filteredTransactions: Transaction[];
  currentPage: number;
  itemsPerPage: number;
}

interface FinanceActions {
  setRole: (role: Role) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setEditingTransaction: (transaction: Transaction | null) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, updated: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  setFilter: (filter: Partial<FilterState>) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
}

type FinanceContextType = FinanceState & FinanceActions;

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEY = 'finance-dashboard-state';

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [role, setRoleState] = useState<Role>('Admin');
  const [isSidebarOpen, setSidebarOpenState] = useState(false);
  const [editingTransaction, setEditingTransactionState] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPageState] = useState(1);
  const [itemsPerPage, setItemsPerPageState] = useState(10);
  const [filter, setFilterState] = useState<FilterState>({
    search: '',
    category: 'All',
    type: 'All',
    startDate: '',
    endDate: '',
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPageState(1);
  }, [filter]);

  // Load state from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API fetch delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        try {
          const { transactions: savedTransactions, role: savedRole, itemsPerPage: savedItemsPerPage } = JSON.parse(savedState);
          if (savedTransactions) setTransactions(savedTransactions);
          if (savedRole) setRoleState(savedRole);
          if (savedItemsPerPage) setItemsPerPageState(savedItemsPerPage);
        } catch (error) {
          console.error('Failed to load state from localStorage:', error);
        }
      }
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Save state to localStorage when transactions, role or itemsPerPage changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, role, itemsPerPage }));
  }, [transactions, role, itemsPerPage]);

  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole);
  }, []);

  const setSidebarOpen = useCallback((isOpen: boolean) => {
    setSidebarOpenState(isOpen);
  }, []);

  const setEditingTransaction = useCallback((transaction: Transaction | null) => {
    setEditingTransactionState(transaction);
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setCurrentPageState(page);
  }, []);

  const setItemsPerPage = useCallback((count: number) => {
    setItemsPerPageState(count);
    setCurrentPageState(1);
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200)); // Mock API delay
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    setIsLoading(false);
  }, []);

  const updateTransaction = useCallback(async (id: string, updated: Partial<Transaction>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200)); // Mock API delay
    setTransactions((prev) => 
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
    setIsLoading(false);
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 150)); // Mock API delay
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setIsLoading(false);
  }, []);

  const setFilter = useCallback((newFilter: Partial<FilterState>) => {
    setFilterState((prev) => ({ ...prev, ...newFilter }));
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(filter.search.toLowerCase()) || 
                            t.category.toLowerCase().includes(filter.search.toLowerCase());
      const matchesCategory = filter.category === 'All' || t.category === filter.category;
      const matchesType = filter.type === 'All' || t.type === filter.type;
      
      // Date range filter
      const tDate = new Date(t.date);
      tDate.setHours(0, 0, 0, 0);
      
      let matchesStartDate = true;
      if (filter.startDate) {
        const start = new Date(filter.startDate);
        start.setHours(0, 0, 0, 0);
        matchesStartDate = tDate >= start;
      }
      
      let matchesEndDate = true;
      if (filter.endDate) {
        const end = new Date(filter.endDate);
        end.setHours(23, 59, 59, 999);
        matchesEndDate = tDate <= end;
      }

      return matchesSearch && matchesCategory && matchesType && matchesStartDate && matchesEndDate;
    });
  }, [transactions, filter]);

  const value = useMemo(() => ({
    transactions,
    filteredTransactions,
    role,
    isSidebarOpen,
    filter,
    editingTransaction,
    isLoading,
    currentPage,
    itemsPerPage,
  }), [
    transactions, 
    filteredTransactions,
    role, 
    isSidebarOpen, 
    filter, 
    editingTransaction,
    isLoading,
    currentPage,
    itemsPerPage,
  ]);

  const actions = useMemo(() => ({
    setRole,
    setSidebarOpen,
    setEditingTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilter,
    setCurrentPage,
    setItemsPerPage,
  }), [
    setRole, 
    setSidebarOpen, 
    setEditingTransaction,
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    setFilter,
    setCurrentPage,
    setItemsPerPage,
  ]);

  const contextValue = useMemo(() => ({ ...value, ...actions }), [value, actions]);

  return (
    <FinanceContext.Provider value={contextValue}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
