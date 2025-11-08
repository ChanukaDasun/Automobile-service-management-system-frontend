// ClientAppointments.tsx
import { useEffect, useState } from "react";
import { appointmentService } from "@/services/appointmentService";
import { socketService } from "@/services/socketService";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function ClientAppointments() {
  const { userId } = useAuth();
  const { user } = useUser();
  
  const clientId = userId || user?.id || "CLIENT_1";
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (!clientId) return;

    appointmentService.getClientAppointments(clientId).then(setAppointments);

    const ws = socketService.connect(clientId, (msg: any) => {
      console.log("Update received:", msg);
      
      // FIX: Only update the appointment that matches the message ID
      setAppointments(prev =>
        prev.map(ap =>
          ap.id === msg.appointmentId ? { 
            ...ap, 
            status: msg.status,
            statusMessage: msg.statusMessage,
            updatedAt: msg.updatedAt
          } : ap
        )
      );
    });

    ws.subscribeToClient(clientId);

    return () => {
      socketService.disconnect();
    };

  }, [clientId]);

  return (
    <div>
      <h2>Client Dashboard</h2>
      {appointments.map(ap => (
        <div key={ap.id} style={{border:"1px solid #ddd", padding:10, margin:5}}>
          <p><b>{ap.description}</b></p>
          <p>Status: {ap.status}</p>
          <p>Message: {ap.statusMessage}</p>
          <p>Last Updated: {new Date(ap.updatedAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}