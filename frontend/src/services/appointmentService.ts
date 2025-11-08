// src/services/appointmentService.ts
export const API = "http://localhost:9000/api/appointments";

export const appointmentService = {
  create: (data: any) => fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  getClientAppointments: (clientId: string) =>
    fetch(`${API}/client/${clientId}`).then(r => r.json()),

  getEmployeeAppointments: (employeeId: string) =>
    fetch(`${API}/employee/${employeeId}`).then(r => r.json()),

  updateStatus: (id: string, employeeId: string, data: any) =>
    fetch(`${API}/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Employee-id": employeeId
      },
      body: JSON.stringify(data)
    }).then(r => r.json()).then(data => {
      return data;
    })
};
