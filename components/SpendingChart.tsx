"use client";

import { useFinance } from "@/lib/context";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useMemo } from "react";
import { useIsHydrated } from "@/lib/use-is-hydrated";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Sophisticated Premium Palette
const COLORS = [
  "var(--brand)",
  "#10b981", // Emerald
  "#6366f1", // Indigo
  "#f59e0b", // Amber
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#42f5ef", // Turquoise
  "#ebe244",
];

export default function SpendingChart() {
  const { transactions } = useFinance();
  const isHydrated = useIsHydrated();

  const data = useMemo(() => {
    if (!isHydrated) return [];

    const expenseTransactions = transactions.filter(
      (t) => t.type === "expense",
    );
    const categoryTotals = expenseTransactions.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, isHydrated]);

  return (
    <Card className="premium-card h-[400px] flex flex-col overflow-hidden border-none shadow-sm ring-1 ring-border/50">
      <CardHeader className="pb-6 bg-muted/10">
        <CardTitle className="text-base font-bold tracking-tight">
          Spending Distribution
        </CardTitle>
        <CardDescription className="text-xs font-normal text-muted-foreground">
          Expense allocation by category
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-[300px] w-full pt-6">
        {isHydrated ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={6}
                dataKey="value"
                stroke="none"
                animationBegin={200}
                animationDuration={1200}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-all duration-300 cursor-pointer outline-none"
                    
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={60}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                    {value}
                  </span>
                )}
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full bg-muted animate-pulse rounded-xl" />
        )}
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
          {payload[0].name}
        </p>
        <p className="text-sm font-bold text-foreground">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};
