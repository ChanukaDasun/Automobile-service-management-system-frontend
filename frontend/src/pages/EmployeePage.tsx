import { useUser } from "@clerk/clerk-react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, Calendar } from "lucide-react"

export default function EmployeePage() {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Employee Dashboard</h1>
          <p className="text-slate-600">Welcome {user?.firstName}! You have the employee role.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-6 w-6 text-blue-600" />
                My Tasks
              </CardTitle>
              <CardDescription>
                View and manage your assigned appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/employee/tasks">
                <Button className="w-full">
                  View My Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-green-600" />
                Schedule
              </CardTitle>
              <CardDescription>
                View your work schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                View Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
