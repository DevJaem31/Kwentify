import { collection, getDocs } from "firebase/firestore";

import { db } from "../../firebase";

export async function fetchOverviewData(uid) {
  if (!uid) {
    throw new Error("A user ID is required.");
  }

  const userRef = `users/${uid}`;

  const [
    accountsSnapshot,
    transactionsSnapshot,
    savingsSnapshot,
    billsSnapshot,
  ] = await Promise.all([
    getDocs(collection(db, `${userRef}/accounts`)),
    getDocs(collection(db, `${userRef}/transactions`)),
    getDocs(collection(db, `${userRef}/savings`)),
    getDocs(collection(db, `${userRef}/bills`)),
  ]);

  const accounts = accountsSnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  const transactions = transactionsSnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  const savings = savingsSnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  const bills = billsSnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  return {
    accounts,
    transactions,
    savings,
    bills,
  };
}
