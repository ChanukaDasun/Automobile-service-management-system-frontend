// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { RoleGuard } from "@/components/RoleGuard";
import AdminPage from "./pages/AdminPage";
import EmployeePage from "./pages/EmployeePage";
import UserPage from "./pages/UserPage";
import { Roles } from "./types/globals";
import Login from "./pages/Login";
import UserLayout from "./layouts/UserLayout";
import ChatWindow from "./pages/ChatWindow";

export default function App() {
  const { user } = useUser();

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
                  user.publicMetadata.role === Roles.Admin ? (
                    <Navigate to="/admin" />
                  ) : user.publicMetadata.role === Roles.Employee ? (
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
                    <UserLayout />
                  </RoleGuard>
                }
              >
                <Route index element={<EmployeePage />} />
                <Route path="chat" element={<ChatWindow />} />
              </Route>
              
              <Route
                path="/user"
                element={
                  <RoleGuard role={Roles.User}>
                    <UserLayout />
                  </RoleGuard>
                }
              >
                <Route index element={<UserPage />} />
                <Route path="chat" element={<ChatWindow />} />
              </Route>
            </Routes>
          </>
        ) : (
          <Login />
        )}
      </div>
    </Router>
  );
}
