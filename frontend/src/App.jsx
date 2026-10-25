import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/AuthPages/loginpage";
import SignupPage from "./pages/AuthPages/signup-page";
import ForgotPasswordPage from "./pages/AuthPages/forgot-password-page";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/Dashboard/dashboard-page";
import NotFound from "./pages/StaticPages/pageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Private routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Add other private routes here */}
        </Route>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Custom 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
