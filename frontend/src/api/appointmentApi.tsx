import axios from "axios";

const API_URL = "http://localhost:9000/api/appointments";

// UPDATED: Match backend CreateAppointmentRequest structure
export interface AppointmentData {
  clientId: string;          // Backend expects clientId
  clientName: string;         // Backend expects clientName
  employeeId?: string;        // Optional - backend will auto-assign if not provided
  employeeName?: string;      // Optional
  description: string;        // Service description
  appointmentDate: string;    // ADDED: Required for daily limit validation (format: YYYY-MM-DD)
}

// UPDATED: Enhanced error response interface
export interface AppointmentError {
  error?: string;
  message: string;
  timestamp?: string;
  status: number;
}

export const createAppointment = async (appointmentData: AppointmentData) => {
  try {
    const response = await axios.post(API_URL, appointmentData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    
    // UPDATED: Handle daily limit error and other backend errors
    if (error.response?.data) {
      const errorData: AppointmentError = error.response.data;
      throw new Error(errorData.message || "Failed to create appointment");
    }
    
    throw new Error("Network error. Please try again.");
  }
};

export const getAppointments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};
