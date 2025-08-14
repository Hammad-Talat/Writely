import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Preloader from "./components/Preloader";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import WriterDashboard from "./Pages/WriterDashboard";
import ReaderDashboard from "./Pages/ReaderDashboard";

function ProtectedRoute({ children }) {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function DashboardSwitch() {
  const user = useSelector((s) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;

  const role = String(user.role || "").toLowerCase();
  if (role === "writer") return <WriterDashboard />;
  if (role === "reader") return <ReaderDashboard />;
  return <div className="p-6">Your account role is not recognized.</div>;
}

export default function App() {
  return (
    <>
      <Preloader brand="Writely" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardSwitch />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
