import { Navigate } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import { Roles } from "@/types/globals"
import React from "react"

interface RoleGuardProps {
  role: typeof Roles
  children: React.ReactNode
}

export const RoleGuard = ({ role, children }: RoleGuardProps) => {
  const { user } = useUser()
  const userRole = user?.publicMetadata?.role

  if (!user) return <Navigate to="/login" /> // not logged in
  if (userRole !== role) return <Navigate to="/" /> // wrong role

  return <>{children}</>
}
