import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next";
import { Geist } from 'next/font/google'
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { FinanceProvider } from "@/lib/context";
import { cn } from "@/lib/utils";


const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FinDash | Personal Finance Dashboard",
  description: "Manage your finances with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={geist.variable} 
    >
      <body
         className={cn(
      "font-sans", 
      "min-h-full bg-white dark:bg-slate-950 selection:bg-primary/10 selection:text-primary transition-colors duration-300"
    )}
      >
        <ThemeProvider 
        attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
          <FinanceProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0 ">
                <Header />
                <main className="flex-1 w-full">
                  <div className="p-4 md:p-10 max-w-[1600px] mx-auto">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </FinanceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
