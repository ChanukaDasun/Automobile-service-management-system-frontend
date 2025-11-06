import axios from "axios";

const API_URL = "http://localhost:9000/api/appointments";

export interface AppointmentData {
  customerId: string;
  vehicleType: string;
  date: string;
  status?: string;
}

export const createAppointment = async (appointmentData: AppointmentData) => {
  try {
    const response = await axios.post(API_URL, appointmentData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    throw error;
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
