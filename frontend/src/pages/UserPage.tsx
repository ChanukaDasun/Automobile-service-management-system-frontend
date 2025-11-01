import { RequireRole } from "../components/RequireRole"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export default function UserPage() {
  const navigate = useNavigate();

  return (
    <RequireRole role="user">
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Welcome to Your Dashboard</h1>
          
          <div className="flex justify-center">
            {/* Book Appointment Card - centered with controlled width/height */}
            <div className="w-full max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 w-full min-h-[20rem] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900">Book Appointment</h2>
                  </div>
                  <p className="text-slate-600 mb-6">
                    Schedule your vehicle service with our expert mechanics. Choose from available time slots and vehicle types.
                  </p>
                </div>

                <div className="mt-4">
                  <Button 
                    onClick={() => navigate('/appointment')}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireRole>
  )
}
