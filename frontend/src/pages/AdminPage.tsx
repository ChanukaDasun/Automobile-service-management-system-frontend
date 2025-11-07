// src/pages/AdminPage.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Appointment, Employee, BackendAppointment } from '@/types/appointment';
import { Calendar, Users, Clock, CheckCircle2, AlertCircle, UserCheck, Settings, RefreshCw } from 'lucide-react';
import DailyLimitsManager from '@/components/DailyLimitsManager';
import { getAllAppointments, getAllEmployees } from '@/api/appointmentApi';

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
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
      
      // Get all appointments from backend
      const appointmentsData = await getAllAppointments();
      
      // Map backend data to frontend format
      const mappedAppointments: Appointment[] = appointmentsData.map((apt: BackendAppointment) => ({
        id: apt.appoinmentId || apt.id || '',
        clientId: apt.customerId || '',
        clientName: apt.clientName || 'Unknown Client',
        vehicleType: apt.vehicleType || 'Not specified',
        appointmentDate: apt.appointmentDate || (apt.createdAt ? apt.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
        timeSlot: apt.timeSlot || 'TBD',
        status: apt.status?.toLowerCase().replace('_', '-') || 'pending',
        assignedEmployeeId: apt.employeeId,
        assignedEmployeeName: apt.employeeName || 'Unassigned',
        createdAt: apt.createdAt || new Date().toISOString(),
        description: apt.description || 'Service'
      }));

      // Filter by date if provided
      const filteredAppointments = date ? 
        mappedAppointments.filter(apt => apt.appointmentDate === date) : 
        mappedAppointments;

      setAppointments(filteredAppointments);
      
      console.log('Fetched appointments for admin:', filteredAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Keep existing appointments on error to prevent empty state
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      // Fetch real employees from the database
      const employeesData = await getAllEmployees();
      
      // Map backend employee data to frontend format with default availability
      const mappedEmployees: Employee[] = employeesData.map(emp => ({
        employeeId: emp.employeeId,
        name: emp.name,
        email: emp.email,
        availability: true, // Default to available (will be enhanced later with real availability logic)
        assignedAppointments: 0 // Default to 0 (will be calculated based on actual appointments)
      }));

      setEmployees(mappedEmployees);
      console.log('Fetched employees from database:', mappedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Keep empty employees array on error instead of showing mock data
      setEmployees([]);
    }
  };

  const handleAssignEmployee = async (appointmentId: string, employeeId: string) => {
    try {
      setAssigningId(appointmentId);

      // TODO: Replace with actual API call
      const employee = employees.find(e => e.employeeId === employeeId);
      
      console.log('Assigning employee:', { appointmentId, employeeId });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setAppointments(prevAppointments =>
        prevAppointments.map(apt =>
          apt.id === appointmentId
            ? {
                ...apt,
                assignedEmployeeId: employeeId,
                assignedEmployeeName: employee?.name,
                status: 'assigned' as const,
              }
            : apt
        )
      );

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/admin/appointments/${appointmentId}/assign`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ employeeId }),
      // });
      // if (response.ok) {
      //   const updated = await response.json();
      //   setAppointments(prev => prev.map(apt => apt.id === appointmentId ? updated : apt));
      // }
    } catch (error) {
      console.error('Error assigning employee:', error);
    } finally {
      setAssigningId(null);
    }
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      assigned: 'bg-blue-100 text-blue-800 border-blue-300',
      'in-progress': 'bg-purple-100 text-purple-800 border-purple-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return badges[status];
  };

  const filteredAppointments = appointments.filter(apt => 
    filterStatus === 'all' || apt.status === filterStatus
  );

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    assigned: appointments.filter(a => a.status === 'assigned').length,
    inProgress: appointments.filter(a => a.status === 'in-progress').length,
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
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
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
                            {appointment.status.replace('-', ' ').toUpperCase()}
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
                      <div className="flex items-center gap-2 min-w-[250px]">
                        {appointment.status === 'pending' || appointment.status === 'assigned' ? (
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
                                {employees
                                  .filter(emp => emp.availability)
                                  .map((employee) => (
                                    <SelectItem key={employee.employeeId} value={employee.employeeId}>
                                      <div className="flex flex-col">
                                        <span className="font-medium">{employee.name}</span>
                                        <span className="text-xs text-slate-500">
                                          {employee.assignedAppointments} task{employee.assignedAppointments !== 1 ? 's' : ''}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            {assigningId === appointment.id && (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="text-slate-600">
                              {appointment.status === 'completed' ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
              {employees.map((employee) => (
                <div
                  key={employee.employeeId}
                  className={`p-4 border rounded-lg ${
                    employee.availability ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5" />
                    <h4 className="font-semibold text-slate-900">{employee.name}</h4>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{employee.email}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className={employee.availability ? 'text-green-700' : 'text-red-700'}>
                      {employee.availability ? 'Available' : 'Busy'}
                    </span>
                    <span className="text-slate-600">
                      {employee.assignedAppointments} task{employee.assignedAppointments !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
