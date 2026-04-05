# FinDash - Advanced Finance Dashboard UI

A clean, modern, and interactive personal finance dashboard built with **Next.js 16**, **Tailwind CSS 4**, and **Recharts**. This project was designed to provide users with a comprehensive view of their financial health with a focus on clean UI/UX and data-driven insights.

## 🚀 Key Features

### 1. Dashboard Overview
- **Real-time Summary Cards**: Instantly view Total Balance, Income, and Expenses with smooth hydration and local storage persistence.
- **Interactive Balance Trend**: A beautiful Area Chart visualizing balance performance over time.
- **Spending Breakdown**: A categorical Pie Chart that highlights where your money is going.

### 2. Advanced Transactions Management
- **Smart Filtering**: Filter by Category, Transaction Type (Income/Expense), or custom Date Ranges.
- **Real-time Search**: Quickly find transactions by description or category.
- **Powerful Pagination**: Handle large datasets gracefully with configurable items per page (5, 10, 20, 50, 100) and smooth page transitions.
- **Admin Actions**: Full CRUD capabilities for Admins to add, edit, and delete transactions with mock API delays for realism.

### 3. Role-Based Access Control (RBAC)
- **Admin Role**: Full access to view and manage financial data.
- **Viewer Role**: Read-only access, perfect for demonstration purposes.
- **Live Switcher**: A quick-switch toggle in the header to demonstrate UI behavior changes based on user roles.

### 4. Data-Driven Insights
- **Smart Analytics**: Automatically identifies the highest spending category.
- **Financial Observations**: Provides actionable insights based on spending patterns.
- **Savings Rate**: Calculates and displays your financial efficiency in real-time.

### 5. Professional Export Functionality
- **Comprehensive CSV Reports**: Generates a professional financial report including:
  - Financial Summary (Balance, Income, Expenses).
  - Savings Rate Analysis.
  - Category-wise Expense Breakdown.
  - Top Spending Item Insights.
  - Detailed Transaction History.

### 6. Premium UI/UX
- **Modern Design**: Built with Shadcn UI components and custom Tailwind CSS 4 utilities.
- **Dark Mode Support**: Fully integrated dark theme with automatic system detection.
- **Geist Typography**: Uses the modern Geist font for superior readability and a premium fintech look.
- **Smooth Animations**: Powered by Framer Motion for a fluid and interactive experience.

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [React Context API](https://react.dev/reference/react/useContext)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

- `app/`: Next.js App Router pages, global styles, and layout configuration.
- `components/`: Reusable UI components (Dashboard, Charts, Filters, etc.).
- `components/ui/`: Low-level Shadcn UI primitives.
- `lib/`: Types, mock data, Context Provider, and utility functions.
- `public/`: Static assets.

## 🧠 Approach & Methodology

1. **State Persistence**: Implemented `localStorage` synchronization within the Context Provider to ensure user data and preferences (like role and items per page) persist across sessions.
2. **Performance Optimization**: Used `useMemo` and `useCallback` to prevent unnecessary re-renders, especially for complex chart data and filtered lists.
3. **Accessibility & Design**: Prioritized high-contrast colors, clear typography (Geist), and intuitive navigation to make financial data accessible and easy to digest.
4. **Clean Code**: Adhered to modern React best practices, including modular component design and a clear separation of concerns between logic and presentation.

---
Created as part of a Finance Dashboard UI Assignment.
