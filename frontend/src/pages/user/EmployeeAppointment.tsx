import { useEffect, useState } from "react";
import { appointmentService } from "@/services/appointmentService";
import { socketService } from "@/services/socketService";
import { useUser } from "@clerk/shared/react/index";
import { useAuth } from "@clerk/clerk-react";

export default function EmployeeAppointments() {
  const { userId } = useAuth();
  const { user } = useUser();
  
  const empId = userId || user?.id || "EMPLOYEE_1";
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    appointmentService.getEmployeeAppointments(empId).then((data) => {
      console.log("Appointments data:", data);
      setAppointments(data);
    });

    socketService.connect(empId, () => {});
  }, [empId]);

  const update = (id: string, status: string, message: string) => {
    appointmentService.updateStatus(id, empId, { 
      status, 
      statusMessage: message 
    })
      .then(res => {
        console.log("Update response:", res);
        setAppointments(prev =>
          prev.map(a => a.id === id ? res : a) // Changed from appointmentId to id
        );
      })
      .catch(err => {
        console.error("Update failed:", err);
        alert("Failed to update appointment");
      });
  };

  return (
    <div>
      <h2>Employee Dashboard</h2>
      {appointments.map(ap => (
        <div key={ap.id} style={{padding:10, border:"1px solid #ccc", margin:5}}>
          <p><b>{ap.description}</b></p>
          <p>Appointment id : {ap.id}</p>
          <p>Client: {ap.clientName}</p>
          <p>Status: {ap.appointmentStatus}</p>
          <p>Message: {ap.statusMessage}</p>
          
          <button onClick={() => update(ap.id, "IN_PROGRESS", "Started Work")}>
            Start
          </button>
          
          <button onClick={() => update(ap.id, "COMPLETED", "Job Completed")}>
            Complete
          </button>
          <button onClick={() => update(ap.id, "CANCELLED", "Job Cancelled")}>
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}