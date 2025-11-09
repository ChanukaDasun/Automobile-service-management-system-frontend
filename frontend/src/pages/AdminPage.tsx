// src/pages/AdminPage.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Calendar, User, Check, X, AlertCircle, Settings, UserCheck, RefreshCw, Users } from 'lucide-react';
import DailyLimitsManager from '@/components/DailyLimitsManager';
import { 
  getAllAppointments, 
  getAppointmentsByDate,
  getAllEmployees, 
  assignEmployeeToAppointment,
  type AdminAppointmentDto,
  type EmployeeDto 
} from '@/api/appointmentApi';

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [appointments, setAppointments] = useState<AdminAppointmentDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  
  // Confirmation state for assignment
  const [pendingAssignment, setPendingAssignment] = useState<{
    appointmentId: string;
    employeeId: string;
    employeeName: string;
    appointmentClient: string;
  } | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showDailyLimits, setShowDailyLimits] = useState(false);

  // Get today's date as default
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    setSelectedDate(getTodayDate());
    fetchEmployees();
    fetchAppointments(); // Load all appointments initially
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAppointments(selectedDate);
    }
  }, [selectedDate]);

  const fetchAppointments = async (date?: string) => {
    try {
      setLoading(true);
      
      // Use the correct AdminDashboardController endpoint
      const appointmentsData = date 
        ? await getAppointmentsByDate(date)  // Use date-specific endpoint 
        : await getAllAppointments();         // Use all appointments endpoint
      
      // appointmentsData is already in AdminAppointmentDto format from the API
      setAppointments(appointmentsData);
      
      console.log('Fetched appointments for admin:', appointmentsData);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Keep existing appointments on error to prevent empty state
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      console.log('Fetching employees using /all-employees endpoint...');
      const employeesData = await getAllEmployees();
      setEmployees(employeesData);
      console.log('Successfully fetched employees:', employeesData);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  const handleAssignEmployee = async (appointmentId: string, employeeId: string) => {
    // Validate inputs
    if (!appointmentId || appointmentId === 'unknown-id') {
      console.error('Invalid appointment ID:', appointmentId);
      alert('Cannot assign employee: Invalid appointment ID');
      return;
    }
    
    if (!employeeId) {
      console.error('Invalid employee ID:', employeeId);
      alert('Cannot assign employee: Invalid employee ID');
      return;
    }

    // Find employee and appointment details for confirmation
    const employee = employees.find(emp => emp.id === employeeId);
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (!employee || !appointment) {
      alert('Employee or appointment not found');
      return;
    }

    // Set pending assignment for confirmation
    setPendingAssignment({
      appointmentId,
      employeeId,
      employeeName: getEmployeeName(employee),
      appointmentClient: appointment.clientName
    });
  };

  const confirmAssignment = async () => {
    if (!pendingAssignment) return;

    try {
      setAssigningId(pendingAssignment.appointmentId);
      
      console.log(`Confirming assignment of ${pendingAssignment.employeeName} to appointment ${pendingAssignment.appointmentId}`);

      // Use the real API call to assign employee to appointment
      const updatedAppointment = await assignEmployeeToAppointment(
        pendingAssignment.appointmentId, 
        pendingAssignment.employeeId
      );

      // Update local state with the response from backend
      setAppointments(prevAppointments =>
        prevAppointments.map(apt =>
          apt.id === pendingAssignment.appointmentId ? updatedAppointment : apt
        )
      );

      console.log('Successfully assigned employee:', updatedAppointment);
      
      // Clear pending assignment
      setPendingAssignment(null);
      
      // Show success message
      alert(`✅ Successfully assigned ${pendingAssignment.employeeName} to ${pendingAssignment.appointmentClient}'s appointment`);
      
    } catch (error) {
      console.error('Error assigning employee:', error);
      alert(error instanceof Error ? error.message : 'Failed to assign employee');
    } finally {
      setAssigningId(null);
    }
  };

  const cancelAssignment = () => {
    setPendingAssignment(null);
  };

  const getStatusBadge = (status: AdminAppointmentDto['status']) => {
    const badges = {
      PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      ASSIGNED: 'bg-blue-50 text-blue-700 border-blue-200',
      IN_PROGRESS: 'bg-purple-50 text-purple-700 border-purple-200',
      COMPLETED: 'bg-green-50 text-green-700 border-green-200',
      CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    };
    return badges[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getDisplayStatus = (status: AdminAppointmentDto['status']) => {
    const statusMap = {
      PENDING: 'Pending',
      ASSIGNED: 'Assigned',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
    };
    return statusMap[status] || 'Unknown';
  };

  const getEmployeeName = (employee: EmployeeDto) => {
    return employee.name || 'Unknown Employee';
  };

  const getAssignedTasksCount = (employeeId: string) => {
    return appointments.filter(apt => apt.assignedEmployeeId === employeeId).length;
  };

  const filteredAppointments = appointments.filter(apt => 
    filterStatus === 'all' || apt.status === filterStatus.toUpperCase()
  );

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'PENDING').length,
    assigned: appointments.filter(a => a.status === 'ASSIGNED').length,
    inProgress: appointments.filter(a => a.status === 'IN_PROGRESS').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard - All Client Appointments</h1>
            <p className="text-slate-600">View and manage all appointments booked by clients across the system</p>
          </div>
          <Button
            onClick={() => setShowDailyLimits(!showDailyLimits)}
            variant={showDailyLimits ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Settings className="h-5 w-5" />
            {showDailyLimits ? 'Hide' : 'Show'} Daily Limits
          </Button>
        </div>

        {/* Daily Limits Manager */}
        {showDailyLimits && (
          <div className="mb-6">
            <DailyLimitsManager />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Assigned</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
                </div>
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">In Progress</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-filter">Filter by Date</Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status-filter">Filter by Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quick Actions</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedDate('');
                      fetchAppointments();
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    View All
                  </Button>
                  <Button
                    onClick={() => fetchAppointments(selectedDate || undefined)}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Loading...' : 'Refresh'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Appointments for {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
            <CardDescription>
              {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <div className="space-y-4">
                {filteredAppointments.map((appointment, index) => {
                  // Debug: Log appointment ID to check if it's valid
                  console.log(`Appointment ${index} ID:`, appointment.id, 'Full appointment:', appointment);
                  
                  return (
                  <div
                    key={appointment.id || `appointment-${index}`}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Appointment Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-slate-900">
                            {appointment.clientName}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(appointment.status)}`}>
                            {getDisplayStatus(appointment.status)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {appointment.timeSlot}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Vehicle:</span>
                            {appointment.vehicleType}
                          </div>
                          {appointment.assignedEmployeeName && (
                            <div className="flex items-center gap-1 col-span-2">
                              <Users className="h-4 w-4" />
                              Assigned to: <span className="font-medium">{appointment.assignedEmployeeName}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Assignment Section */}
                      <div className="flex items-center gap-2 min-w-[300px]">
                        {appointment.status === 'PENDING' || appointment.status === 'ASSIGNED' ? (
                          <>
                            <Select
                              value={appointment.assignedEmployeeId || ''}
                              onValueChange={(value) => handleAssignEmployee(appointment.id, value)}
                              disabled={assigningId === appointment.id}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Assign employee" />
                              </SelectTrigger>
                              <SelectContent>
                                {employees.map((employee) => (
                                    <SelectItem key={employee.id} value={employee.id}>
                                      <div className="flex flex-col">
                                        <span className="font-medium">{getEmployeeName(employee)}</span>
                                        <span className="text-xs text-slate-500">
                                          {getAssignedTasksCount(employee.id)} task{getAssignedTasksCount(employee.id) !== 1 ? 's' : ''}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            
                            {/* Direct Action Buttons */}
                            {pendingAssignment?.appointmentId === appointment.id ? (
                              <div className="flex items-center gap-1">
                                <Button
                                  onClick={confirmAssignment}
                                  size="sm"
                                  className="h-8 px-2 bg-green-600 hover:bg-green-700 text-white"
                                  disabled={assigningId === appointment.id}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={cancelAssignment}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 border-red-200 text-red-600 hover:bg-red-50"
                                  disabled={assigningId === appointment.id}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : assigningId === appointment.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            ) : null}
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="text-slate-600">
                              {getDisplayStatus(appointment.status)}
                            </span>
                          </div>
                        )}
                      </div>


                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No appointments found for this date</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Employees */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Available Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {employees.map((employee) => {
                const assignedTasks = getAssignedTasksCount(employee.id);
                const isAvailable = assignedTasks < 5; // Assuming max 5 tasks per employee
                return (
                  <div
                    key={employee.id}
                    className={`p-4 border rounded-lg ${
                      isAvailable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5" />
                      <h4 className="font-semibold text-slate-900">{getEmployeeName(employee)}</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{employee.email}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className={isAvailable ? 'text-green-700' : 'text-red-700'}>
                        {isAvailable ? 'Available' : 'Busy'}
                      </span>
                      <span className="text-slate-600">
                        {assignedTasks} task{assignedTasks !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
