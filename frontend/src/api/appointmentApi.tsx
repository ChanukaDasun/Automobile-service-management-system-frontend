import axios, { AxiosError } from "axios";

// Base API URLs matching the backend controller
const API_BASE_URL = "http://localhost:9000";
const ADMIN_API_URL = `${API_BASE_URL}/api/admin`;
const API_URL = `${API_BASE_URL}/api/appointments`;

// Health check function to test backend connectivity
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing backend connection...');
    const response = await axios.get(`${API_BASE_URL}/api/admin/appointments/stats`);
    console.log('Backend connection successful:', response.status);
    return true;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
};

// UPDATED: Match backend CreateAppointmentRequest structure
export interface AppointmentData {
  clientId: string;          // Backend expects clientId
  clientName: string;         // Backend expects clientName
  employeeId?: string;        // Optional - backend will auto-assign if not provided
  employeeName?: string;      // Optional
  description: string;        // Service description
  appointmentDate: string;    // ADDED: Required for daily limit validation (format: YYYY-MM-DD)
  serviceTypeId: string;      // ADDED: Service type ID (e.g., "basic", "standard", "premium")
  serviceTypeName: string;    // ADDED: Service type name (e.g., "Basic Service", "Premium Service")
}

// UPDATED: Enhanced error response interface
export interface AppointmentError {
  error?: string;
  message: string;
  timestamp?: string;
  status: number;
}

// Backend DTO interfaces matching AdminDashboardDtos.AppointmentDto
export interface AppointmentDto {
  id: string;                    // matches: String id
  clientId: string;              // matches: String clientId  
  clientName: string;            // matches: String clientName
  vehicleType: string;           // matches: String vehicleType
  appointmentDate: string;       // matches: LocalDate appointmentDate (ISO date string)
  timeSlot: string;              // matches: String timeSlot
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'; // matches: AppointmentStatus
  assignedEmployeeId?: string;   // matches: String assignedEmployeeId (nullable)
  assignedEmployeeName?: string; // matches: String assignedEmployeeName (nullable)
  createdAt: string;             // matches: String createdAt
  description: string;           // matches: String description
}

// For compatibility with admin dashboard, we'll also keep this interface
export interface AdminAppointmentDto {
  id: string;
  clientId: string;
  clientName: string;
  vehicleType?: string;
  appointmentDate: string;
  timeSlot?: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  description: string;
  createdAt: string;
}

// Backend EmployeeDto from AdminDashboardDtos.EmployeeDto
export interface EmployeeDto {
  id: string;
  name: string;                    // matches: String name (not firstName/lastName)
  email: string;                   // matches: String email
  availability: boolean;           // matches: boolean availability
  assignedAppointments: number;    // matches: int assignedAppointments
}

// ClerkUserDto interface matching backend - flexible to handle different field names
export interface ClerkUserDto {
  id: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  emailAddress?: string;
  role?: string;
  [key: string]: any; // Allow for any additional fields from Clerk API
}

// Backend AssignEmployeeRequest - only employeeId needed (appointmentId comes from URL path)
export interface AssignEmployeeRequest {
  employeeId: string;      // This is what the controller uses via getEmployeeId()
}

// Backend UpdateStatusRequest from AdminDashboardDtos.UpdateStatusRequest  
export interface UpdateStatusRequest {
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

// Helper function to convert backend AdminDashboardDtos.AppointmentDto to frontend AdminAppointmentDto
export const convertToAdminFormat = (backendApt: AppointmentDto): AdminAppointmentDto => {
  console.log('Converting AdminDashboardDto appointment from backend:', backendApt);

  return {
    id: backendApt.id,                                        // Direct mapping: String id
    clientId: backendApt.clientId,                            // Direct mapping: String clientId
    clientName: backendApt.clientName || 'Unknown Client',    // Direct mapping: String clientName
    vehicleType: backendApt.vehicleType || 'Not specified',   // Direct mapping: String vehicleType
    appointmentDate: backendApt.appointmentDate,              // Direct mapping: LocalDate appointmentDate
    timeSlot: backendApt.timeSlot || 'Not scheduled',         // Direct mapping: String timeSlot
    status: backendApt.status || 'PENDING',                   // Direct mapping: AppointmentStatus status
    assignedEmployeeId: backendApt.assignedEmployeeId || undefined, // Direct mapping: String assignedEmployeeId
    assignedEmployeeName: backendApt.assignedEmployeeName || undefined, // Direct mapping: String assignedEmployeeName
    description: backendApt.description || 'No description provided', // Direct mapping: String description
    createdAt: backendApt.createdAt || new Date().toISOString() // Direct mapping: String createdAt
  };
};

// Admin Dashboard API Functions

/**
 * Get all appointments - uses /api/admin/appointments/all from AdminDashboardController
 */
export const getAllAppointments = async (status?: string): Promise<AdminAppointmentDto[]> => {
  try {
    console.log('Fetching all appointments from admin dashboard endpoint...');
    // Use the correct AdminDashboardController endpoint: GET /api/admin/appointments/all
    const url = status ? `${ADMIN_API_URL}/appointments/all?status=${status.toUpperCase()}` : `${ADMIN_API_URL}/appointments/all`;
    console.log('Making request to:', url);
    
    const response = await axios.get(url);
    console.log('Response status:', response.status);
    console.log('Raw appointments from backend:', response.data);
    
    // Log first appointment to check field names
    if (response.data && response.data.length > 0) {
      console.log('First appointment structure:', Object.keys(response.data[0]));
      console.log('First appointment data:', response.data[0]);
    }
    
    // The AdminDashboardController returns AppointmentDto[] which matches our backend interface
    const backendAppointments: AppointmentDto[] = response.data;
    const adminAppointments = backendAppointments.map(convertToAdminFormat);
    
    console.log('Converted appointments to admin format:', adminAppointments);
    
    // Check if IDs are properly set
    adminAppointments.forEach((apt, index) => {
      if (!apt.id || apt.id === 'unknown-id') {
        console.warn(`Appointment ${index} has invalid ID:`, apt.id, 'Original data:', backendAppointments[index]);
      }
    });
    
    return adminAppointments;
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    if (error instanceof AxiosError) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Request URL:', error.config?.url);
      
      if (error.response?.status === 404) {
        console.log('Admin appointments endpoint not found, returning empty array...');
        return [];
      }
      if (error.response?.status === 500) {
        console.log('Server error occurred, returning empty array...');
        return [];
      }
    }
    throw error;
  }
};

/**
 * Get appointments by date - uses /api/admin/appointments from AdminDashboardController
 */
export const getAppointmentsByDate = async (date: string, status?: string): Promise<AdminAppointmentDto[]> => {
  try {
    console.log(`Fetching appointments for date: ${date}`);
    // Use the correct AdminDashboardController endpoint with date parameter
    const url = status 
      ? `${ADMIN_API_URL}/appointments?date=${date}&status=${status.toUpperCase()}` 
      : `${ADMIN_API_URL}/appointments?date=${date}`;
    const response = await axios.get(url);
    console.log('Raw appointments from backend:', response.data);
    
    // The AdminDashboardController returns AppointmentDto[] which matches our backend interface
    const backendAppointments: AppointmentDto[] = response.data;
    const adminAppointments = backendAppointments.map(convertToAdminFormat);
    
    console.log('Converted appointments to admin format:', adminAppointments);
    
    return adminAppointments;
  } catch (error) {
    console.error("Error fetching appointments by date:", error);
    if (error instanceof AxiosError && error.response?.status === 404) {
      console.log('Admin appointments endpoint not available, returning empty array...');
      return [];
    }
    throw error;
  }
};

/**
 * Get all employees - uses /api/admin/employees from AdminDashboardController  
 */
export const getAllEmployees = async (): Promise<EmployeeDto[]> => {
  try {
    console.log('Fetching all employees from admin dashboard all-employees endpoint...');
    console.log('Making request to:', `${ADMIN_API_URL}/all-employees`);
    
    const response = await axios.get(`${ADMIN_API_URL}/all-employees`);
    console.log('Response status:', response.status);
    console.log('Successfully fetched employees (ClerkUserDto[]):', response.data);
    
    // The /api/admin/all-employees endpoint returns ClerkUserDto[] filtered for employees
    const clerkEmployees: ClerkUserDto[] = response.data;
    
    // Convert ClerkUserDto to EmployeeDto format for UI compatibility
    const employees: EmployeeDto[] = clerkEmployees.map((clerkEmp) => ({
      id: clerkEmp.id,
      name: `${clerkEmp.firstName || clerkEmp.first_name || 'Unknown'} ${clerkEmp.lastName || clerkEmp.last_name || 'User'}`.trim(),
      email: clerkEmp.email || clerkEmp.emailAddress || 'no-email@example.com',
      availability: true,  // Default to available since ClerkUserDto doesn't have this field
      assignedAppointments: 0  // Default to 0 since we need to calculate this separately
    }));
    
    console.log('Converted employees for UI:', employees);
    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    if (error instanceof AxiosError) {
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Request URL:', error.config?.url);
      
      if (error.response?.status === 404) {
        console.log('Employees endpoint not found, returning empty array...');
        return [];
      }
      if (error.response?.status === 500) {
        console.log('Server error occurred, returning empty array...');
        return [];
      }
    }
    // Return empty array instead of throwing to prevent UI from breaking
    return [];
  }
};

/**
 * Assign employee to appointment - uses /api/admin/appointments/{appointmentId}/assign
 */
export const assignEmployeeToAppointment = async (appointmentId: string, employeeId: string): Promise<AdminAppointmentDto> => {
  try {
    console.log(`Assigning employee ${employeeId} to appointment ${appointmentId}`);
    
    // Validate inputs
    if (!appointmentId || appointmentId.trim() === '') {
      throw new Error('Invalid appointment ID provided');
    }
    if (!employeeId || employeeId.trim() === '') {
      throw new Error('Invalid employee ID provided');
    }
    
    const assignRequest: AssignEmployeeRequest = {
      employeeId: employeeId.trim()  // Only include employeeId - appointmentId comes from URL path
    };
    
    const url = `${ADMIN_API_URL}/appointments/${appointmentId.trim()}/assign`;
    console.log('Making assignment request to:', url);
    console.log('Assignment request body:', assignRequest);
    
    const response = await axios.patch(url, assignRequest, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Assignment response status:', response.status);
    console.log('Successfully assigned employee:', response.data);
    // Convert backend AdminDashboardDtos.AppointmentDto response to AdminAppointmentDto format
    return convertToAdminFormat(response.data);
  } catch (error) {
    console.error("Error assigning employee:", error);
    if (error instanceof AxiosError) {
      console.error('Assignment error status:', error.response?.status);
      console.error('Assignment error data:', error.response?.data);
      console.error('Assignment request URL:', error.config?.url);
      console.error('Assignment request method:', error.config?.method);
      console.error('Assignment request headers:', error.config?.headers);
      console.error('Assignment request body:', error.config?.data);
      
      if (error.response?.status === 400) {
        // 400 Bad Request - check if it's a backend service issue
        console.error('400 Bad Request Details:');
        console.error('- AppointmentId:', appointmentId, '(length:', appointmentId?.length, ')');
        console.error('- EmployeeId:', employeeId, '(length:', employeeId?.length, ')');
        console.error('- Response headers:', error.response.headers);
        
        // The backend returns 400 with no error message, suggesting service layer issue
        throw new Error(`Assignment failed: Either the appointment (${appointmentId}) doesn't exist, the employee (${employeeId}) doesn't exist, or there's a business rule preventing this assignment. Check your backend logs for more details.`);
      }
      
      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(errorData.message || `Failed to assign employee (${error.response.status})`);
      }
    }
    throw new Error("Network error during assignment");
  }
};

/**
 * Update appointment status - uses /api/admin/appointments/{appointmentId}/status
 */
export const updateAppointmentStatus = async (appointmentId: string, status: AdminAppointmentDto['status']): Promise<AdminAppointmentDto> => {
  try {
    console.log(`Updating appointment ${appointmentId} status to: ${status}`);
    
    const statusRequest: UpdateStatusRequest = {
      status: status
    };
    
    const response = await axios.patch(
      `${ADMIN_API_URL}/appointments/${appointmentId}/status`,
      statusRequest,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Successfully updated appointment status:', response.data);
    return convertToAdminFormat(response.data);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    if (error instanceof AxiosError && error.response?.data) {
      const errorData = error.response.data;
      throw new Error(errorData.message || "Failed to update appointment status");
    }
    throw new Error("Network error during status update");
  }
};

/**
 * Get employee tasks - uses /api/admin/employees/{employeeId}/tasks or fallback to /api/appointments/employee/{employeeId}
 */
export const getEmployeeTasks = async (employeeId: string): Promise<AdminAppointmentDto[]> => {
  try {
    console.log(`Fetching tasks for employee: ${employeeId}`);
    
    // Try admin endpoint first
    try {
      const response = await axios.get(`${ADMIN_API_URL}/employees/${employeeId}/tasks`);
      console.log('Successfully fetched employee tasks from admin endpoint:', response.data);
      return response.data;
    } catch (adminError) {
      console.log('Admin endpoint not available, trying appointment endpoint...');
      
      // Fallback to appointment controller endpoint
      const response = await axios.get(`${API_URL}/employee/${employeeId}`);
      console.log('Successfully fetched employee tasks from appointment endpoint:', response.data);
      
      // Convert backend format to admin format
      const backendTasks: AppointmentDto[] = response.data;
      return backendTasks.map(convertToAdminFormat);
    }
  } catch (error) {
    console.error("Error fetching employee tasks:", error);
    if (error instanceof AxiosError && error.response?.status === 404) {
      return []; // Return empty array if employee has no tasks
    }
    throw error;
  }
};

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

// Get employee by ID using AdminDashboardDtos.EmployeeDto structure
export const getEmployeeById = async (employeeId: string): Promise<EmployeeDto | null> => {
  try {
    const employees = await getAllEmployees();
    const employee = employees.find(emp => emp.id === employeeId);
    return employee || null;
  } catch (error) {
    console.error("Error fetching employee:", error);
    return null;
  }
};

// Additional helper functions can be added here as needed
