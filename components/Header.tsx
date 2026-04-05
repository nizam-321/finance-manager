'use client';


import { useFinance } from '@/lib/context';
import { User, Shield, Eye, Bell, Menu, X, Search, ChevronDown, Moon, Sun, LogOut, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsHydrated } from '@/lib/use-is-hydrated';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { role, setRole, isSidebarOpen, setSidebarOpen } = useFinance();
  const isHydrated = useIsHydrated();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full bg-background/60 backdrop-blur-xl border-b px-4 md:px-8 h-20 flex items-center justify-between">
      {/* Left Section: Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="md:hidden"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        
        <div className="hidden md:flex items-center max-w-md w-full relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
          <Input 
            type="text" 
            placeholder="Search transactions, insights..." 
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Right Section: Role Toggle, Notifications, Profile */}
      <div className="flex items-center gap-3 md:gap-6">
        {isHydrated && (
          <div className="flex items-center rounded-xl   p-1 ring-1 ring-border/50">
            <Button
              variant={role === 'Admin' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setRole('Admin')}
              className={cn(
                "h-8 gap-2 px-3 text-[11px] font-medium cursor-pointer uppercase tracking-wider ",
                role === 'Admin' ? "bg-background  text-brand" : "text-muted-foreground"
              )}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
            <Button
              variant={role === 'Viewer' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setRole('Viewer')}
              className={cn(
                "h-8 gap-2 px-3 text-[11px] font-medium cursor-pointer uppercase tracking-wider",
                role === 'Viewer' ? "bg-background text-brand" : "text-muted-foreground"
              )}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Viewer</span>
            </Button>
          </div>
        )}

        <div className="h-6 w-px bg-border hidden sm:block"></div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button 
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 rounded-xl hover:bg-brand/5 hover:text-brand transition-colors"
          >
            {isHydrated && (theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />)}
          </Button>
          
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-brand/5 hover:text-brand transition-colors">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-background"></span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 p-1 pr-3 h-11 rounded-xl hover:bg-muted/50 transition-all border border-transparent hover:border-border">
                <Avatar className="w-8 h-8 border border-background shadow-sm">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-brand/10 text-brand text-[10px] font-bold">JD</AvatarFallback>
                </Avatar>
                {isHydrated && (
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-foreground leading-none">John Doe</p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">{role}</p>
                  </div>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer">
                <User className="w-4 h-4 text-muted-foreground" /> <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer">
                <Settings className="w-4 h-4 text-muted-foreground" /> <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-rose-500 focus:text-rose-500 focus:bg-rose-500/10 rounded-lg cursor-pointer">
                <LogOut className="w-4 h-4" /> <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
