import { createBrowserRouter, Navigate } from "react-router-dom";

import LoginPage from "../pages/AuthPages/loginpage";
import SignupPage from "../pages/AuthPages/signup-page";
import ForgotPasswordPage from "../pages/AuthPages/forgot-password-page";

import ProtectedRoute from "../routes/protectedRoute";
import DashboardPage from "../pages/ProtectedPages/dashboardPage";
import NotFound from "../pages/StaticPages/pageNotFound";

import OverviewPage from "../pages/ProtectedPages/overviewPage";
// import TransactionsPage from "../pages/Transactions/transactions-page";
// import BudgetsPage from "../pages/Budgets/budgets-page";
// import SavingsPage from "../pages/Savings/savings-page";
// import InvestmentsPage from "../pages/Investments/investments-page";
import SettingsPage from "../pages/ProtectedPages/settingsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
        children: [
          {
            index: true,
            element: <OverviewPage />,
          },
          //   {
          //     path: "transactions",
          //     element: <TransactionsPage />,
          //   },
          //   {
          //     path: "budgets",
          //     element: <BudgetsPage />,
          //   },
          //   {
          //     path: "savings",
          //     element: <SavingsPage />,
          //   },
          //   {
          //     path: "investments",
          //     element: <InvestmentsPage />,
          //   },
          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
