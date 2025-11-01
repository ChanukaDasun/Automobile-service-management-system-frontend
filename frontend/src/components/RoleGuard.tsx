import { Navigate } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import { Roles } from "../types/globals"
import React from "react"

interface RoleGuardProps {
  role:  Roles
  children: React.ReactNode
}

export const RoleGuard = ({ role, children }: RoleGuardProps) => {
  const { user } = useUser()
  const userRole = user?.publicMetadata?.role as Roles | undefined
  
  console.log('User Role:', userRole, 'Required Role:', role);

  if (!user) return <Navigate to="/login" /> // not logged in
  
  // If user has no role, default to 'user' role
  const effectiveRole = userRole || Roles.User;
  
  // Check if user has the required role
  if (effectiveRole !== role) {
    console.log('Access denied: User role does not match required role');
    return <Navigate to="/" /> // wrong role, redirect to home
  }

  return <>{children}</>
}
