export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'Food & Dining' 
  | 'Shopping' 
  | 'Entertainment' 
  | 'Utilities' 
  | 'Transport' 
  | 'Rent' 
  | 'Salary' 
  | 'Freelance' 
  | 'Investments' 
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: Category;
  type: TransactionType;
  description: string;
}

export type Role = 'Admin' | 'Viewer';

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  balanceTrend: { date: string; balance: number }[];
  categoryBreakdown: { category: Category; amount: number }[];
}
