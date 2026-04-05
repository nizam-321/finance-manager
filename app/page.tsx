'use client';

import { useFinance } from '@/lib/context';
import DashboardCards from '@/components/DashboardCards';
import TrendsChart from '@/components/TrendsChart';
import SpendingChart from '@/components/SpendingChart';
import TransactionList from '@/components/TransactionList';
import TransactionFilters from '@/components/TransactionFilters';
import TransactionForm from '@/components/TransactionForm';
import InsightsSection from '@/components/InsightsSection';

export default function Home() {
  const { transactions } = useFinance();

  // Export financial data as CSV report
  const handleExport = () => {
    if (transactions.length === 0) return;

    // Calculate totals
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(2) : '0.00';

    // Category-wise expense totals
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Highest single expense
    const highestExpense = transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)[0];

    // Build CSV content
    const csvContent = [
      'FINANCIAL PERFORMANCE REPORT',
      `Date of Report,${new Date().toLocaleDateString()}`,
      '',
      'OVERALL SUMMARY',
      `Total Balance,${balance}`,
      `Total Income,${income}`,
      `Total Expenses,${expenses}`,
      `Savings Rate,${savingsRate}%`,
      '',
      'EXPENSE BY CATEGORY',
      'Category,Total Spent',
      ...Object.entries(categoryTotals).map(([cat, total]) => `${cat},${total}`),
      '',
      'QUICK INSIGHTS',
      highestExpense
        ? `Top Spending Item,${highestExpense.description} (${highestExpense.amount})`
        : 'Top Spending Item,None',
      '',
      'TRANSACTION DETAILS',
      'Date,Description,Category,Type,Amount',
      ...transactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        `"${t.description.replace(/"/g, '""')}"`,
        t.category,
        t.type,
        t.amount
      ].join(','))
    ].join('\n');

    // Trigger file download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `finance_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-sm text-slate-600 mt-1 tracking-widest">
            Welcome back! Here&apos;s your financial summary.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-5 py-2.5 rounded-xl cursor-pointer bg-slate-900 dark:bg-primary dark:text-black text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-primary/90 shadow-lg shadow-slate-900/10 dark:shadow-primary/20 transition-all active:scale-95"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <DashboardCards />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TrendsChart />
        <SpendingChart />
      </div>

      {/* Insights Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Smart Insights</h3>
        </div>
        <InsightsSection />
      </section>

      {/* Transactions Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Activity</h3>
          <TransactionForm />
        </div>
        <div className="p-6 rounded-[32px]">
          <TransactionFilters />
          <TransactionList />
        </div>
      </section>
    </div>
  );
}