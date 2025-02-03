import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LogIn from "../pages/login/LogIn";
import SignUp from "../pages/signup/SignUp";
import ChatPage from "../pages/chatInterface/ChatPage";
import { useAppContext } from "../appContext/AppContext";

// Reusable ProtectedRoute component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({
  element,
}) => {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAppContext();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={isAuthenticated ? <ChatPage /> : <Navigate to={"/login"} replace/>} />

      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={"/"} replace /> : <LogIn />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to={"/"} replace /> : <SignUp />}
      />

      {/* Protected Routes */}
      <Route path="/:id" element={<ProtectedRoute element={<ChatPage />} />} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
