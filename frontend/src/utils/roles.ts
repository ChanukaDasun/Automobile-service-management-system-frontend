import { useUser } from "@clerk/clerk-react"
import { Roles } from "@/types/globals"

export const checkRole = (role: typeof Roles): boolean => {
  const { user } = useUser()
  return user?.publicMetadata?.role === role
}
