// Appointment related types
export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  vehicleType: string;
  appointmentDate: string;
  timeSlot: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  description?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  availability: boolean;
  assignedAppointments?: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

export interface DailyAvailability {
  date: string;
  totalSlots: number;
  bookedSlots: number;
  remainingSlots: number;
  limitReached: boolean;
  timeSlots: TimeSlot[];
}

export interface VehicleType {
  id: string;
  name: string;
  description?: string;
  serviceTime: number; // in minutes
}
