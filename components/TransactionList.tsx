'use client';

import { useFinance } from '@/lib/context';
import { formatCurrency, cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Trash2, Edit2, Search, ExternalLink, ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { useIsHydrated } from '@/lib/use-is-hydrated';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export default function TransactionList() {
  const { 
    filteredTransactions, 
    role, 
    deleteTransaction, 
    setEditingTransaction,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    filter,
    setFilter,
    transactions
  } = useFinance();
  const isHydrated = useIsHydrated();

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handleExport = () => {
    if (transactions.length === 0) return;

    // 1. Summary Calculate karein
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(2) : '0.00';

    // 1. Category Breakdown calculate karein
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // 2. Highest Expense item dhoondhein (Quick Insight)
    const highestExpense = transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => b.amount - a.amount)[0];

    // 2. CSV Content taiyar karein
    const csvContent = [
      'FINANCIAL PERFORMANCE REPORT',
      `Date of Report,${new Date().toLocaleDateString()}`,
      '',
      // Overall Summary & Savings Rate
      'OVERALL SUMMARY',
      `Total Balance,${balance}`,
      `Total Income,${income}`,
      `Total Expenses,${expenses}`,
      `Savings Rate,${savingsRate}%`,
      '',
      // Category-wise Breakdown (Analysis)
      'EXPENSE BY CATEGORY',
      'Category,Total Spent',
      ...Object.entries(categoryTotals).map(([cat, total]) => `${cat},${total}`),
      '',
      // Quick Insight (Monthly Trend)
      'QUICK INSIGHTS',
      highestExpense 
        ? `Top Spending Item,${highestExpense.description} (${highestExpense.amount})` 
        : 'Top Spending Item,None',
      '',
      // Detail Transactions
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

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isHydrated) {
    return (
      <div className="premium-card p-8 space-y-6 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-muted rounded-xl" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-32" />
                <div className="h-3 bg-muted rounded w-20" />
              </div>
            </div>
            <div className="h-4 bg-muted rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="premium-card overflow-hidden shadow-none">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-6 border-b bg-card/50">
        <div>
          <h2 className="text-xl font-medium tracking-tight">Recent Transactions</h2>
          <p className="text-sm text-muted-foreground font-normal">Your financial activity overview</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Picker in Header */}
          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border border-border/50">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-9 px-3 rounded-lg text-xs font-normal", 
                    !filter.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="w-3.5 h-3.5 mr-2 opacity-50" />
                  {filter.startDate ? format(new Date(filter.startDate), "MMM dd") : "Start Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl shadow-2xl border-none" align="start">
                <Calendar 
                  mode="single" 
                  selected={filter.startDate ? new Date(filter.startDate) : undefined} 
                  onSelect={(date) => setFilter({ startDate: date ? date.toISOString() : '' })} 
                  initialFocus 
                />
              </PopoverContent>
            </Popover>

            <span className="text-muted-foreground/30 text-xs">/</span>

            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-9 px-3 rounded-lg text-xs font-normal", 
                    !filter.endDate && "text-muted-foreground"
                  )}
                >
                  {filter.endDate ? format(new Date(filter.endDate), "MMM dd") : "End Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl shadow-2xl border-none" align="end">
                <Calendar 
                  mode="single" 
                  selected={filter.endDate ? new Date(filter.endDate) : undefined} 
                  onSelect={(date) => setFilter({ endDate: date ? date.toISOString() : '' })} 
                  initialFocus 
                />
              </PopoverContent>
            </Popover>

            {(filter.startDate || filter.endDate) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFilter({ startDate: '', endDate: '' })}
                className="h-7 w-7 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>

          <Button 
            onClick={handleExport} 
            variant="outline" 
            className="h-11 rounded-xl font-semibold bg-background border-border/50 hover:bg-muted/50 transition-all"
          >
            Export <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[300px] dark:text-white  uppercase tracking-wider text-black pl-6">Transaction</TableHead>
              <TableHead className="  uppercase dark:text-white tracking-wider text-black">Category</TableHead>
              <TableHead className="  uppercase dark:text-white tracking-wider text-black">Date</TableHead>
              <TableHead className="text-right  dark:text-white uppercase tracking-wider text-black pr-6">Amount</TableHead>
              {role === 'Admin' && <TableHead className="text-right pr-6"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {paginatedTransactions.map((t) => (
                <motion.tr
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  key={t.id}
                  className="group transition-all duration-200 hover:bg-muted/30 border-b border-border/50 last:border-0"
                >
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0  transition-transform group-hover:scale-105",
                        t.type === 'income' 
                          ? " text-emerald-600 dark:text-emerald-400" 
                          : " text-rose-600 dark:text-rose-400"
                      )}>
                        {t.type === 'income' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate group-hover:text-brand transition-colors">{t.description}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">{t.type}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold text-[10px] py-0 h-5 bg-background border-border/50">
                      {t.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-muted-foreground">
                    {format(new Date(t.date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className={cn(
                    "text-sm font-normal text-right tabular-nums pr-6",
                    t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  )}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </TableCell>
                  {role === 'Admin' && (
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-1 opacity-100 translate-x-0 lg:opacity-0 lg:translate-x-2 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 transition-all duration-200">
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingTransaction(t)}
                          className="h-8 w-8 hover:bg-brand/10 hover:text-brand rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTransaction(t.id)}
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between bg-muted/5">
            <p className="text-xs text-muted-foreground font-medium">
              Showing <span className="text-foreground">{startIndex + 1}</span> to <span className="text-foreground">{Math.min(startIndex + itemsPerPage, filteredTransactions.length)}</span> of <span className="text-foreground">{filteredTransactions.length}</span> results
            </p>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-1 mx-1">
                {getPageNumbers().map((page, idx) => (
                  page === '...' ? (
                    <span key={`dots-${idx}`} className="px-2 text-muted-foreground text-xs">...</span>
                  ) : (
                    <Button
                      key={`page-${page}`}
                      variant={currentPage === page ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setCurrentPage(page as number)}
                      className={cn(
                        "h-8 w-8 rounded-lg text-xs font-bold",
                        currentPage === page ? "bg-brand/10 text-brand" : "text-muted-foreground"
                      )}
                    >
                      {page}
                    </Button>
                  )
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {filteredTransactions.length === 0 && (
          <div className="px-8 py-24 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-muted/50 border border-dashed border-border/50">
              <Search className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <p className="font-bold text-lg tracking-tight">No results found</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-[250px] mx-auto">We couldn't find any transactions matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
