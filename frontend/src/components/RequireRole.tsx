import { useUser } from "@clerk/clerk-react"
import { Navigate } from "react-router-dom"
import type { JSX } from "react/jsx-runtime"

interface RequireRoleProps {
  role: string
  children: JSX.Element
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { user } = useUser()
  const userRole = user?.publicMetadata?.role as string | undefined
  console.log(userRole);
  if (!user || userRole !== role) {
    return <Navigate to="/heloo" />
  }

  return children
}
