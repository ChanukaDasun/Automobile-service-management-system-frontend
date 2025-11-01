// src/pages/AdminPage.tsx
import { useUser } from "@clerk/clerk-react"

export default function AdminPage() {
  const { user } = useUser()

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome {user?.firstName}! You have the `admin` role.</p>
      {/* Add user management or role-changing features here */}
    </div>
  )
}
