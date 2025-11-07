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
  estimatedCompletion?: string; // Added for employee to set estimated completion time
  createdAt: string;
}

// Backend appointment data structure
export interface BackendAppointment {
  appoinmentId?: string;
  id?: string;
  customerId: string;
  clientId?: string;
  clientName: string;
  vehicleType: string;
  appointmentDate?: string;
  timeSlot?: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  employeeId?: string;
  employeeName?: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Employee {
  employeeId: string;
  name: string;
  email: string;
  availability?: boolean;
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
