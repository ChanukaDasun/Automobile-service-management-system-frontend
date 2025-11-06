import { Navigate } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import { Roles } from "../types/globals"
import React from "react"

interface RoleGuardProps {
  role:  Roles
  children: React.ReactNode
}

export const RoleGuard = ({ role, children }: RoleGuardProps) => {
  const { user, isLoaded } = useUser()
  const userRole = user?.publicMetadata?.role as Roles | undefined
  
  console.log('RoleGuard Check:', { 
    isLoaded,
    userId: user?.id,
    userRole, 
    requiredRole: role,
    userMetadata: user?.publicMetadata 
  });

  // Wait for user data to load
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />
  }
  
  // If user has no role, default to 'user' role
  const effectiveRole = userRole || Roles.User;
  
  console.log('Effective Role:', effectiveRole, 'Required Role:', role);
  
  // Check if user has the required role
  if (effectiveRole !== role) {
    console.log('Access denied: User role does not match required role');
    console.log(`User has role "${effectiveRole}" but route requires "${role}"`);
    return <Navigate to="/" replace />
  }

  console.log('Access granted!');
  return <>{children}</>
}
