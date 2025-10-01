// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useClerk, UserButton } from "@clerk/clerk-react"
import { Button } from "@/components/ui/button"
import { RoleGuard } from "@/components/RoleGuard"
import AdminPage from "./pages/AdminPage"
import EmployeePage from "./pages/EmployeePage"
import UserPage from "./pages/UserPage"
import { Roles } from "./types/globals"


export default function App() {
  const { openSignIn } = useClerk()

  return (
    <Router>
      <div>
        <UserButton />
        <Button onClick={() => openSignIn()}>Login</Button>

        <Routes>
          <Route
            path="/admin"
            element={
              <RoleGuard role={Roles.Admin}>
                <AdminPage />
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
            path="/employee"
            element={
              <RoleGuard role={Roles.Employee}>
                <EmployeePage />
              </RoleGuard>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}
