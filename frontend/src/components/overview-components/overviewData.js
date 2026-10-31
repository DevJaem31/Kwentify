import { Wallet, ArrowDownLeft, ArrowUpRight, PiggyBank } from "lucide-react";

export const summaryItems = [
  {
    title: "Total Balance",
    amount: "₱2,540.75",
    description: "Across all accounts",
    icon: Wallet,
  },
  {
    title: "Total Income",
    amount: "₱3,200.00",
    description: "This month",
    icon: ArrowDownLeft,
  },
  {
    title: "Total Expenses",
    amount: "₱1,659.25",
    description: "This month",
    icon: ArrowUpRight,
  },
  {
    title: "Savings",
    amount: "₱875.50",
    description: "Current savings",
    icon: PiggyBank,
  },
];

export const reminders = [
  {
    title: "Budget Review",
    description: "Today · 7:00 PM",
    icon: "calendar",
  },
  {
    title: "Pay Credit Card Bill",
    description: "May 10, 2025",
    icon: "wallet",
  },
  {
    title: "Save for Vacation Goal",
    description: "May 15, 2025",
    icon: "target",
  },
];

export const transactions = [
  {
    title: "Grocery Store",
    category: "Food & Dining",
    date: "May 6, 2025",
    amount: "-₱45.20",
    type: "expense",
  },
  {
    title: "Online Shop",
    category: "Shopping",
    date: "May 5, 2025",
    amount: "-₱79.99",
    type: "expense",
  },
  {
    title: "Salary",
    category: "Income",
    date: "May 1, 2025",
    amount: "+₱3,200.00",
    type: "income",
  },
];
