import { createBrowserRouter, Navigate } from "react-router-dom";

import LoginPage from "../pages/AuthPages/loginpage";
import SignupPage from "../pages/AuthPages/signup-page";
import ForgotPasswordPage from "../pages/AuthPages/forgot-password-page";

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
]);

export default router;
