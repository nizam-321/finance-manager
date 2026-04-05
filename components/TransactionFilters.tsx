'use client';

import { useState, useEffect } from 'react';
import { useFinance } from '@/lib/context';
import { Search, Calendar as CalendarIcon } from 'lucide-react';
import { Category } from '@/lib/types';
import { useIsHydrated } from '@/lib/use-is-hydrated';
import { useDebounce } from '@/lib/hooks';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const CATEGORIES: (Category | 'All')[] = [
  'All', 'Food & Dining', 'Shopping', 'Entertainment', 'Utilities', 'Transport', 
  'Rent', 'Salary', 'Freelance', 'Investments', 'Other'
];

export default function TransactionFilters() {
  const { filter, setFilter, itemsPerPage, setItemsPerPage } = useFinance();
  const isHydrated = useIsHydrated();
  
  const [searchTerm, setSearchTerm] = useState(filter.search);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    setFilter({ search: debouncedSearch });
  }, [debouncedSearch, setFilter]);

  useEffect(() => {
    setSearchTerm(filter.search);
  }, [filter.search]);

  if (!isHydrated) return <div className="h-12 mb-8 bg-muted/50 rounded-xl animate-pulse" />;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-brand transition-colors z-10" />
          <Input
            type="text"
            placeholder="Search transactions, categories..."
            className="pl-11 h-11 bg-muted/30 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-brand/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select
            value={filter.category}
            onValueChange={(value) => setFilter({ category: value as any })}
          >
            <SelectTrigger className="h-11 min-w-[160px] rounded-xl font-normal bg-muted/30 border-none focus:ring-1 focus:ring-brand/20">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl p-1">
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="rounded-lg font-normal">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filter.type}
            onValueChange={(value) => setFilter({ type: value as any })}
          >
            <SelectTrigger className="h-11 min-w-[140px] rounded-xl font-normal bg-muted/30 border-none focus:ring-1 focus:ring-brand/20">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl p-1">
              <SelectItem value="All" className="rounded-lg font-normal">All Types</SelectItem>
              <SelectItem value="income" className="rounded-lg font-normal">Income</SelectItem>
              <SelectItem value="expense" className="rounded-lg font-normal">Expense</SelectItem>
            </SelectContent>
          </Select>

          <div className="h-8 w-px bg-border/50 mx-1 hidden lg:block" />

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest hidden lg:block">Show</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
            >
              <SelectTrigger className="h-11 min-w-[80px] rounded-xl font-normal bg-muted/30 border-none focus:ring-1 focus:ring-brand/20">
                <SelectValue placeholder="Count" />
              </SelectTrigger>
              <SelectContent className="rounded-xl p-1">
                {[5, 10, 20, 50, 100].map((count) => (
                  <SelectItem key={count} value={count.toString()} className="rounded-lg font-normal">
                    {count}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
