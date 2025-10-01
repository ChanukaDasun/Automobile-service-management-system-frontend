import { RequireRole } from "../components/RequireRole"

export default function UserPage() {
  return (
    <RequireRole role="user">
      <div>UserPage</div>
    </RequireRole>
  )
}
