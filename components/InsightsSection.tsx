'use client';

import { useFinance } from '@/lib/context';
import { formatCurrency, cn } from '@/lib/utils';
import { Lightbulb, TrendingDown, Target, Zap, ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { useIsHydrated } from '@/lib/use-is-hydrated';
import { Card, CardContent } from '@/components/ui/card';

export default function InsightsSection() {
  const { transactions } = useFinance();
  const isHydrated = useIsHydrated();

  const insights = useMemo(() => {
    if (!isHydrated) return [];

    const expenseTransactions = transactions.filter((t) => t.type === 'expense');
    const categoryTotals = expenseTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    return [
      {
        title: 'Spending Pattern',
        description: highestCategory 
          ? `Your biggest expense is ${highestCategory[0]}.` 
          : 'No spending data available.',
        value: highestCategory ? formatCurrency(highestCategory[1]) : '$0.00',
        icon: TrendingDown,
        color: 'text-rose-600',
        bg: 'bg-accent-red/5',
        action: 'Review category',
      },
      {
        title: 'Savings Goal',
        description: 'You can save up to $45/mo by optimizing utilities.',
        value: '$540/year',
        icon: Target,
        color: 'text-blue-600',
        bg: 'bg-primary/5',
        action: 'View plan',
      },
      {
        title: 'Smart Alert',
        description: 'Grocery spending is down 15% from last month.',
        value: 'Efficiency up!',
        icon: Zap,
        color: 'text-emerald-600',
        bg: 'bg-accent-green/5',
        action: 'See details',
      },
    ];
  }, [transactions, isHydrated]);

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-slate-50 dark:bg-slate-900 rounded-[24px] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {insights.map((insight, idx) => (
      
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col h-full relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-full shrink-0 bg-muted">
                    <insight.icon className={cn("w-5 h-5", insight.color)} />
                  </div>
                  <Lightbulb className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <div className="flex-1">
                  <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{insight.title}</h4>
                  <p className="text-sm font-medium leading-snug mb-2">
                    {insight.description}
                  </p>
                  <p className={cn("text-lg font-semibold tabular-nums", insight.color)}> 
                   {insight.value} 
                  </p>
                </div>

                <button className="mt-6 flex items-center gap-1.5 text-sm text-primary hover:underline">
                  {insight.action}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </CardContent>
          </Card>
      ))}
    </div>
  );
}
