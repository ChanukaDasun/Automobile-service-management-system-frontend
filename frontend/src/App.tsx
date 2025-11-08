// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { RoleGuard } from "@/components/RoleGuard";
import AdminPage from "./pages/AdminPage";
import EmployeePage from "./pages/EmployeePage";
import EmployeeTasks from "./pages/EmployeeTasks";
import ClientDashboard from "./pages/ClientDashboard";
import Appointment from "./pages/Appointment";
import Notification from "./pages/Notification";
import { Roles } from "./types/globals";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { NotificationProvider } from "./contexts/NotificationContext";
import Test from "./pages/Test";
import ChatWindow from "./pages/ChatWindow";
import EmployeeChatWindow from "./pages/EmployeeChatWindow";

export default function App() {
  const { user } = useUser();

  return (
    <NotificationProvider>
      <Router>
        <div>
          <Navbar/>
          <Routes>
            {/* Landing/Home page - accessible to everyone */}
            <Route path="/" element={<Login />} />
            
            {/* Login route - redirect to landing page (same content) */}
            <Route path="/login" element={<Navigate to="/" replace />} />

            {/* Protected routes - require authentication */}
            {user !== null || user !== undefined ? (
              <>
                <Route
                  path="/admin"
                  element={
                    <RoleGuard role={Roles.Admin}>
                      <AdminPage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/employee"
                  element={
                    <RoleGuard role={Roles.Employee}>
                      <EmployeePage />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/employee/tasks"
                  element={
                    <RoleGuard role={Roles.Employee}>
                      <EmployeeTasks />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/user-dashboard"
                  element={
                    <RoleGuard role={Roles.User}>
                      <ClientDashboard />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/appointment"
                  element={
                    <RoleGuard role={Roles.User}>
                      <Appointment />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/notification"
                  element={
                    <RoleGuard role={Roles.User}>
                      <Notification />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/user/test"
                  element={
                    <RoleGuard role={Roles.User}>
                      <Test />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/employee/test"
                  element={
                    <RoleGuard role={Roles.Employee}>
                      <Test />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/user/chat"
                  element={
                    <RoleGuard role={Roles.User}>
                      <ChatWindow />
                    </RoleGuard>
                  }
                />
                <Route
                  path="/emp/chat"
                  element={
                    <RoleGuard role={Roles.Employee}>
                      <EmployeeChatWindow />
                    </RoleGuard>
                  }
                />
              </>
            ) : (
              // Redirect all other routes to login when not authenticated
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}
