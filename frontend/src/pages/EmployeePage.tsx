import { RequireRole } from "../components/RequireRole"

export default function EmployeePage() {
  return (
    <RequireRole role="employee">
      <div>EmployeePage</div>
    </RequireRole>
  )
}
