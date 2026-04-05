import { Transaction, Category } from './types';
import { subDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const CATEGORIES: Category[] = [
  'Food & Dining', 'Shopping', 'Entertainment', 'Utilities', 'Transport', 
  'Rent', 'Salary', 'Freelance', 'Investments', 'Other'
];

const generateMockTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() > 0.7;
    const date = subDays(now, Math.floor(Math.random() * 90)); // Last 90 days
    const category = isIncome 
      ? (Math.random() > 0.5 ? 'Salary' : 'Freelance') as Category
      : CATEGORIES[Math.floor(Math.random() * (CATEGORIES.length - 3))] as Category; // Exclude income categories

    transactions.push({
      id: Math.random().toString(36).substr(2, 9),
      date: date.toISOString(),
      amount: isIncome ? Math.floor(Math.random() * 5000) + 1000 : Math.floor(Math.random() * 500) + 10,
      category,
      type: isIncome ? 'income' : 'expense',
      description: isIncome ? 'Payment received' : `Purchase at ${['Amazon', 'Uber', 'Starbucks', 'Netflix', 'Rent'][Math.floor(Math.random() * 5)]}`,
    });
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const INITIAL_TRANSACTIONS = generateMockTransactions(50);

export const MOCK_CHART_DATA = () => {
  const now = new Date();
  const start = startOfMonth(subDays(now, 30));
  const end = endOfMonth(now);
  const days = eachDayOfInterval({ start, end });

  let balance = 15000;
  return days.map(day => {
    const dayStr = format(day, 'MMM dd');
    const dayTransactions = INITIAL_TRANSACTIONS.filter(t => 
      format(new Date(t.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );

    dayTransactions.forEach(t => {
      if (t.type === 'income') balance += t.amount;
      else balance -= t.amount;
    });

    return {
      date: dayStr,
      balance,
      income: dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
      expense: dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    };
  });
};
