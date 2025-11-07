import axios, { AxiosError } from "axios";

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
  } catch (error) {
    console.error("Error creating appointment:", error);
    
    // UPDATED: Handle daily limit error and other backend errors
    if (error instanceof AxiosError && error.response?.data) {
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
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

export const getUserAppointments = async (clientId: string) => {
  try {
    const response = await axios.get(`${API_URL}/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    throw error;
  }
};

// Employee API endpoints - using UserController
const USER_API_URL = "http://localhost:9000/api/users";

export interface Employee {
  employeeId: string;
  name: string;
  email: string;
}

// ClerkUserDto interface from backend
interface ClerkUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// Get all employees by filtering users with employee role
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await axios.get(`${USER_API_URL}/employees`);
    const employeeUsers: ClerkUserDto[] = response.data;
    
    // Map ClerkUserDto to Employee interface
    return employeeUsers.map(user => ({
      employeeId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email
    }));
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

// Get employee by ID
export const getEmployeeById = async (employeeId: string): Promise<Employee> => {
  try {
    // Get all employees and find the specific one
    const employees = await getAllEmployees();
    const employee = employees.find(emp => emp.employeeId === employeeId);
    if (!employee) {
      throw new Error(`Employee with ID ${employeeId} not found`);
    }
    return employee;
  } catch (error) {
    console.error("Error fetching employee:", error);
    throw error;
  }
};

// Note: Create, update, and delete operations for employees should be handled through user management
// These functions are kept for API compatibility but may not be implemented in the backend
export const createEmployee = async (employee: Omit<Employee, 'employeeId'>): Promise<Employee> => {
  try {
    console.warn("Creating employees should be done through user management system");
    throw new Error("Employee creation not supported through this endpoint");
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

// Update employee
export const updateEmployee = async (employeeId: string, employee: Omit<Employee, 'employeeId'>): Promise<Employee> => {
  try {
    console.warn("Updating employees should be done through user management system");
    console.log("Attempted to update employee:", employeeId, employee);
    throw new Error("Employee update not supported through this endpoint");
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

// Delete employee
export const deleteEmployee = async (employeeId: string): Promise<void> => {
  try {
    console.warn("Deleting employees should be done through user management system");
    console.log("Attempted to delete employee:", employeeId);
    throw new Error("Employee deletion not supported through this endpoint");
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};
