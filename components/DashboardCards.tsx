'use client';

import { useFinance } from '@/lib/context';
import { formatCurrency, cn } from '@/lib/utils';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useIsHydrated } from '@/lib/use-is-hydrated';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardCards() {
  const { transactions } = useFinance();
  const isHydrated = useIsHydrated();

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    if (!isHydrated) return { totalIncome: 0, totalExpenses: 0, balance: 0 };

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses
    };
  }, [transactions, isHydrated]);

  const cards = useMemo(() => [
    {
      title: 'Current Balance',
      amount: balance,
      description: 'Total available funds',
      icon: Wallet,
      
      iconColor: 'text-brand',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Monthly Income',
      amount: totalIncome,
      description: 'Total earnings this month',
      icon: TrendingUp,
      
      iconColor: 'text-emerald-500',
      trend: '+4.3%',
      trendUp: true,
    },
    {
      title: 'Monthly Expenses',
      amount: totalExpenses,
      description: 'Total spending this month',
      icon: TrendingDown,
     
      iconColor: 'text-rose-500',
      trend: '-2.1%',
      trendUp: false,
    },
  ], [balance, totalIncome, totalExpenses]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
          <Card key={card.title}  className="premium-card relative overflow-hidden h-full border-none shadow-sm ring-1 ring-border/50 bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10 space-y-0">
              <div className={cn(
                "p-2.5 rounded-xl",
                card.iconColor
              )}>
                <card.icon className="w-5 h-5" />
              </div>
              
              <div className={cn(
                "flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full",
                card.trendUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
              )}>
                {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.trend}
              </div>
            </CardHeader>

            <CardContent className="relative z-10 pt-4">
              <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">{card.title}</p>
              {isHydrated ? (
                <div className="flex flex-col">
                  <h3 className={cn(
                    "text-2xl lg:text-3xl font-normal tracking-tight",
                    card.amount < 0 && card.title === 'Current Balance' ? "text-rose-500" : "text-foreground"
                  )}>
                    {formatCurrency(card.amount)}
                  </h3>
                  <p className="text-[10px] text-muted-foreground/70 mt-1 font-medium italic">
                    {card.description}
                  </p>
                </div>
              ) : (
                <div className="h-10 w-36 bg-muted animate-pulse rounded-lg mt-1" />
              )}
            </CardContent>
          </Card>
      ))}
    </div>
  );
}
