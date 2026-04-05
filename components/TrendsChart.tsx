'use client';

import { useFinance } from '@/lib/context';
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import { useIsHydrated } from '@/lib/use-is-hydrated';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TrendsChart() {
  const { transactions } = useFinance();
  const isHydrated = useIsHydrated();

  const chartData = useMemo(() => {
    if (!isHydrated) return [];

    const now = new Date();
    const days = eachDayOfInterval({
      start: subDays(now, 29),
      end: now,
    });

    let runningBalance = 15000; // Starting baseline
    const initialTransactions = transactions.filter(t => new Date(t.date) < startOfDay(subDays(now, 29)));
    initialTransactions.forEach(t => {
      if (t.type === 'income') runningBalance += t.amount;
      else runningBalance -= t.amount;
    });

    return days.map((day) => {
      const dayTransactions = transactions.filter(
        (t) => format(new Date(t.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );

      dayTransactions.forEach((t) => {
        if (t.type === 'income') runningBalance += t.amount;
        else runningBalance -= t.amount;
      });

      return {
        date: format(day, 'MMM dd'),
        balance: runningBalance,
      };
    });
  }, [transactions, isHydrated]);

  return (
    <Card className="premium-card h-[400px] flex flex-col overflow-hidden border-none shadow-sm ring-1 ring-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 bg-muted/10">
        <div>
          <CardTitle className="text-base font-bold tracking-tight">Financial Growth</CardTitle>
          <CardDescription className="text-xs font-normal text-muted-foreground">Net balance performance over 30 days</CardDescription>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-brand/10 rounded-full">
          <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          <span className="text-[10px] font-bold text-brand uppercase tracking-widest">Live</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 min-h-[300px] w-full pt-6">
        {isHydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-fill)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--chart-fill)" stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.8} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }}
                minTickGap={40}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }}
                tickFormatter={(value) => `$${value / 1000}k`}
                dx={-5}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: 'var(--brand)', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="var(--brand)" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full bg-muted animate-pulse rounded-xl" />
        )}
      </CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-foreground">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}
