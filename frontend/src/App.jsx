import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";
import Preloader from "./components/Preloader";
import Login from "./Pages/Login";      
import Register from "./Pages/Register";
import WriterDashboard from "./Pages/WriterDashboard";
import ReaderDashboard from "./Pages/ReaderDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function DashboardSwitch() {
  return  <WriterDashboard /> 
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
                <DashboardSwitch />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
