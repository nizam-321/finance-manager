'use client';

import { 
  LayoutDashboard, 
  ReceiptText, 
  PieChart, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useFinance } from '@/lib/context';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'overview' },
  { icon: ReceiptText, label: 'Transactions', id: 'transactions' },
  { icon: PieChart, label: 'Analytics', id: 'analytics' },
  { icon: CreditCard, label: 'Cards', id: 'payments' },
  { icon: TrendingUp, label: 'Growth', id: 'investments' },
];

const secondaryItems = [
  { icon: Settings, label: 'Settings', id: 'settings' },
  { icon: HelpCircle, label: 'Support', id: 'support' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('overview');
  const { isSidebarOpen, setSidebarOpen, role } = useFinance();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "bg-card dark:bg-background/60 border-r flex flex-col z-40 h-screen sticky top-0 shrink-0 shadow-sm",
          "md:translate-x-0 fixed md:sticky",
          !isSidebarOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 shrink-0 overflow-hidden">
          <div className="w-9 h-9 brand-gradient rounded-xl flex items-center justify-center  shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 text-xl font-bold tracking-tight text-gradient whitespace-nowrap"
              >
                FinFlow
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-4 space-y-8 overflow-y-auto overflow-x-hidden">
          {/* Main Menu */}
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Main Menu</p>
            )}
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveItem(item.id)}
                className={cn(
                  "w-full justify-start px-3 py-2.5 h-11 rounded-xl group relative transition-all duration-200",
                  activeItem === item.id 
                    ? "text-foreground " 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <item.icon className={cn(
                  "w-[18px] h-[18px] shrink-0 transition-colors",
                  activeItem === item.id ? "text-brand" : "text-muted-foreground group-hover:text-foreground"
                )} />
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {activeItem === item.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand"
                  />
                )}
              </Button>
            ))}
          </div>

          {/* Secondary Menu */}
          <div className="space-y-1">
            {!collapsed && (
              <p className="px-2 mb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Support</p>
            )}
            {secondaryItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start px-3 py-2.5 h-11 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground group"
              >
                <item.icon className="w-[18px] h-[18px] shrink-0 group-hover:text-foreground transition-colors" />
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Footer Actions & Profile */}
        <div className="p-4 space-y-4 border-t bg-muted/30 dark:bg-transparent">
          {!collapsed ? (
            <div className="flex items-center gap-3 px-2 py-1">
              <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                <AvatarImage src="" />
                <AvatarFallback className="bg-brand/10 text-brand text-xs font-bold">JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">{role}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                <AvatarFallback className="bg-brand/10 text-brand text-xs font-bold">JD</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center h-10 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-transparent hover:border-border"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span className="ml-2 text-xs font-medium">Minimize</span>}
          </Button>
        </div>
      </motion.aside>
    </>
  );
}
