import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";

import { auth } from "../../firebase";
import { fetchOverviewData } from "../services/overviewServices";

const EMPTY_DATA = {
  accounts: [],
  transactions: [],
  savings: [],
  bills: [],
};

function toDate(value) {
  if (!value) return null;

  const date = value?.toDate
    ? value.toDate()
    : value instanceof Date
      ? value
      : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getCurrentMonthTransactions(transactions) {
  const now = new Date();

  return transactions.filter((transaction) => {
    const date = toDate(transaction.date);

    return (
      date &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });
}

function getAmount(value) {
  return Math.abs(Number(value) || 0);
}

export default function useOverviewData() {
  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const loadData = useCallback(async (uid) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchOverviewData(uid);
      setData(result);
    } catch (err) {
      setError(err);

      toast.error("Unable to load your financial overview.", {
        description: err.code ? `${err.code}: ${err.message}` : err.message,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);

      if (currentUser) {
        loadData(currentUser.uid);
      } else {
        setData(EMPTY_DATA);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [loadData]);

  const monthTransactions = getCurrentMonthTransactions(data.transactions);

  const totalBalance = data.accounts.reduce(
    (total, account) => total + (Number(account.balance) || 0),
    0,
  );

  const totalIncome = monthTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + getAmount(item.amount), 0);

  const totalExpenses = monthTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + getAmount(item.amount), 0);

  const totalSavings = data.savings.reduce(
    (total, saving) => total + getAmount(saving.amount),
    0,
  );

  const recentTransactions = [...data.transactions]
    .sort((a, b) => {
      const dateA = toDate(a.date || a.createdAt)?.getTime() || 0;
      const dateB = toDate(b.date || b.createdAt)?.getTime() || 0;

      return dateB - dateA;
    })
    .slice(0, 5);

  const pendingBills = data.bills
    .filter((bill) => bill.status?.toLowerCase() !== "paid")
    .sort((a, b) => {
      const dateA = toDate(a.dueDate)?.getTime() || 0;
      const dateB = toDate(b.dueDate)?.getTime() || 0;

      return dateA - dateB;
    });

  return {
    user,
    data,
    loading: loading || !authReady,
    error,
    refresh: () => user && loadData(user.uid),

    summary: {
      totalBalance,
      totalIncome,
      totalExpenses,
      totalSavings,
    },

    recentTransactions,
    pendingBills,
  };
}
