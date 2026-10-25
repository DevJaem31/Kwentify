import { createBrowserRouter, Navigate } from "react-router-dom";

import LoginPage from "../pages/AuthPages/loginpage";
import SignupPage from "../pages/AuthPages/signup-page";
import ForgotPasswordPage from "../pages/AuthPages/forgot-password-page";

import ProtectedRoute from "./protectedRoute";
import DashboardPage from "../pages/ProtectedPages/dashboardPage";
import NotFound from "../pages/StaticPages/pageNotFound";

const router = createBrowserRouter([
  // Public routes
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

  // Private routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
    ],
  },

  // Default route
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // Custom 404 page
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
