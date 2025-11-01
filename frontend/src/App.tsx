// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { RoleGuard } from "@/components/RoleGuard";
import AdminPage from "./pages/AdminPage";
import EmployeePage from "./pages/EmployeePage";
import EmployeeTasks from "./pages/EmployeeTasks";
import UserPage from "./pages/UserPage";
import Appointment from "./pages/Appointment";
import { Roles } from "./types/globals";
import Login from "./pages/Login";

export default function App() {
  const { user } = useUser();

  // Get user role, default to 'user' if not set
  const userRole = (user?.publicMetadata?.role as Roles) || Roles.User;

  return (
    <Router>
      <div>
        <UserButton />
        {user ? (
          <>
            <Routes>
              <Route
                path="/"
                element={
                  userRole === Roles.Admin ? (
                    <Navigate to="/admin" />
                  ) : userRole === Roles.Employee ? (
                    <Navigate to="/employee" />
                  ) : (
                    <Navigate to="/user" />
                  )
                }
              />
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
                path="/user"
                element={
                  <RoleGuard role={Roles.User}>
                    <UserPage />
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
            </Routes>
          </>
        ) : (
          <Login />
        )}
      </div>
    </Router>
  );
}
