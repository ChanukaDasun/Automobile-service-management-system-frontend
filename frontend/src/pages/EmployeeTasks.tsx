import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Appointment } from '@/types/appointment';
import { Calendar, Clock, CheckCircle2, AlertCircle, Car, Play, Check, Edit3, Save, X } from 'lucide-react';

export default function EmployeeTasks() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingEstimateId, setEditingEstimateId] = useState<string | null>(null);
  const [estimateInput, setEstimateInput] = useState<string>('');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);

      // Get employee ID from authenticated user
      const employeeId = user?.id;
      if (!employeeId) {
        throw new Error('No employee ID available - user not authenticated');
      }
      
      console.log('Using employee ID:', employeeId);

      console.log('Fetching tasks for employee ID:', employeeId);
      // Fetch tasks from real backend API
      const response = await fetch(`http://localhost:9000/api/employee/tasks?employeeId=${employeeId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Tasks API error:', response.status, errorText);
        throw new Error(`Failed to fetch tasks: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Received tasks data:', data);
      
      // Map backend data to frontend format
      const mappedTasks: Appointment[] = data.map((task: any) => ({
        id: task.id,
        clientId: task.clientId,
        clientName: task.clientName,
        vehicleType: task.vehicleType || 'Unknown Vehicle',
        appointmentDate: task.appointmentDate,
        timeSlot: task.timeSlot || 'Time not set',
        status: task.status.toLowerCase().replace('_', '-') as Appointment['status'],
        assignedEmployeeId: task.employeeId,
        assignedEmployeeName: task.employeeName,
        description: task.description,
        estimatedCompletion: task.estimatedCompletion,
        createdAt: task.createdAt,
      }));
      
      setTasks(mappedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      console.error('User ID:', user?.id);
      
      // More detailed error message
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to load tasks: ${errorMsg}\n\nUser ID: ${user?.id}\n\nPlease check the console for more details.`);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleUpdateStatus = async (taskId: string, newStatus: Appointment['status']) => {
    try {
      setUpdatingId(taskId);

      // Get employee ID from authenticated user
      const employeeId = user?.id;
      if (!employeeId) {
        throw new Error('No employee ID available - user not authenticated');
      }



      // Convert frontend status to backend format
      const backendStatus = newStatus.toUpperCase().replace('-', '_');
      
      // Make real API call to update status
      const response = await fetch(`http://localhost:9000/api/employee/tasks/${taskId}/status?employeeId=${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: backendStatus,
          statusMessage: `Task ${newStatus} by employee`
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }
      
      const updated = await response.json();
      
      // Update local state with response from backend
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? {
            ...task,
            status: updated.status.toLowerCase().replace('_', '-') as Appointment['status'],
            updatedAt: updated.updatedAt
          } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Function to handle setting estimated completion time
  const handleSetEstimatedCompletion = async (taskId: string, estimatedTime: string) => {
    try {
      setUpdatingId(taskId);

      // Get employee ID from authenticated user
      const employeeId = user?.id;
      if (!employeeId) {
        throw new Error('No employee ID available - user not authenticated');
      }

      // Validate time format (simple validation)
      if (!estimatedTime || !estimatedTime.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
        alert('Please enter a valid time in HH:MM format (e.g., 14:30)');
        return;
      }



      // Make real API call to set estimated completion
      const response = await fetch(`http://localhost:9000/api/employee/tasks/${taskId}/estimated-completion?employeeId=${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estimatedCompletion: estimatedTime }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to set estimated completion: ${response.status}`);
      }
      
      const updated = await response.json();

      // Update local state with response from backend
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, estimatedCompletion: updated.estimatedCompletion, updatedAt: updated.updatedAt } : task
        )
      );

      // Clear editing state
      setEditingEstimateId(null);
      setEstimateInput('');
    } catch (error) {
      console.error('Error setting estimated completion:', error);
      alert('Failed to set estimated completion time. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  // 🆕 Function to start editing estimated completion
  const startEditingEstimate = (taskId: string, currentEstimate?: string) => {
    setEditingEstimateId(taskId);
    setEstimateInput(currentEstimate || '');
  };

  // Function to cancel editing
  const cancelEditingEstimate = () => {
    setEditingEstimateId(null);
    setEstimateInput('');
  };

  // Add state for statistics
  const [statistics, setStatistics] = useState<{
    totalTasks: number;
    assignedTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    todayTasks: number;
    pastTasks: number;
  } | null>(null);

  // Function to fetch statistics from backend
  const fetchStatistics = useCallback(async () => {
    try {
      // Get employee ID from authenticated user
      const employeeId = user?.id;
      if (!employeeId) {
        throw new Error('No employee ID available - user not authenticated');
      }
      
      console.log('Fetching statistics for employee ID:', employeeId);

      console.log('Fetching statistics for employeeId:', employeeId);
      const response = await fetch(`http://localhost:9000/api/employee/tasks/statistics?employeeId=${employeeId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Statistics API error:', response.status, errorText);
        throw new Error(`Failed to fetch statistics: ${response.status} - ${errorText}`);
      }
      
      const stats = await response.json();
      console.log('Statistics fetched successfully:', stats);
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Set empty statistics as fallback
      setStatistics({
        totalTasks: 0,
        assignedTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
        todayTasks: 0,
        pastTasks: 0
      });
    }
  }, [user?.id]);

  // Fetch statistics when component mounts
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Function to fetch today's tasks specifically
  const fetchTodayTasks = useCallback(async () => {
    try {
      const employeeId = user?.id;
      if (!employeeId) {
        throw new Error('No employee ID available - user not authenticated');
      }

      const response = await fetch(`http://localhost:9000/api/employee/tasks/today?employeeId=${employeeId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch today's tasks: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.map((task: any) => ({
        id: task.id,
        clientId: task.clientId,
        clientName: task.clientName,
        vehicleType: task.vehicleType || 'Unknown Vehicle',
        appointmentDate: task.appointmentDate,
        timeSlot: task.timeSlot || 'Time not set',
        status: task.status.toLowerCase().replace('_', '-') as Appointment['status'],
        assignedEmployeeId: task.employeeId,
        assignedEmployeeName: task.employeeName,
        description: task.description,
        estimatedCompletion: task.estimatedCompletion,
        createdAt: task.createdAt,
      }));
    } catch (error) {
      console.error('Error fetching today\'s tasks:', error);
      return [];
    }
  }, [user?.id]);

  // Function to fetch past tasks specifically
  const fetchPastTasks = useCallback(async () => {
    try {
      const employeeId = user?.id;
      if (!employeeId) {
        throw new Error('No employee ID available - user not authenticated');
      }

      const response = await fetch(`http://localhost:9000/api/employee/tasks/past?employeeId=${employeeId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch past tasks: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.map((task: any) => ({
        id: task.id,
        clientId: task.clientId,
        clientName: task.clientName,
        vehicleType: task.vehicleType || 'Unknown Vehicle',
        appointmentDate: task.appointmentDate,
        timeSlot: task.timeSlot || 'Time not set',
        status: task.status.toLowerCase().replace('_', '-') as Appointment['status'],
        assignedEmployeeId: task.employeeId,
        assignedEmployeeName: task.employeeName,
        description: task.description,
        estimatedCompletion: task.estimatedCompletion,
        createdAt: task.createdAt,
      }));
    } catch (error) {
      console.error('Error fetching past tasks:', error);
      return [];
    }
  }, [user?.id]);

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

  // Use backend statistics if available, otherwise fall back to calculated stats
  const stats = statistics ? {
    total: statistics.totalTasks,
    assigned: statistics.assignedTasks,
    inProgress: statistics.inProgressTasks,
    completed: statistics.completedTasks,
  } : {
    total: tasks.length,
    assigned: tasks.filter(t => t.status === 'assigned').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  // Use dedicated API calls for different task types
  const [todayTasks, setTodayTasks] = useState<Appointment[]>([]);
  const [pastTasksList, setPastTasksList] = useState<Appointment[]>([]);

  // Load today's and past tasks when component mounts
  useEffect(() => {
    const loadTodayTasks = async () => {
      const today = await fetchTodayTasks();
      setTodayTasks(today);
    };
    
    const loadPastTasks = async () => {
      const past = await fetchPastTasks();
      setPastTasksList(past);
    };

    // Only load tasks if user is authenticated
    if (user?.id) {
      loadTodayTasks();
      loadPastTasks();
    }
  }, [fetchTodayTasks, fetchPastTasks, user?.id]);

  const upcomingTasks = tasks.filter(
    t => new Date(t.appointmentDate) > new Date() && t.status !== 'completed' && t.status !== 'cancelled'
  );

  const pastTasks = pastTasksList;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Tasks</h1>
          <p className="text-slate-600">
            Welcome {user?.firstName}! Here are your assigned appointments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Tasks</p>
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
                  <p className="text-sm text-slate-600">Assigned</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
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
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Today's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Today's Tasks
                </CardTitle>
                <CardDescription>
                  {todayTasks.length} appointment{todayTasks.length !== 1 ? 's' : ''} scheduled for today
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todayTasks.length > 0 ? (
                  <div className="space-y-4">
                    {todayTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          {/* Task Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Car className="h-5 w-5 text-blue-600" />
                              <h3 className="font-semibold text-lg text-slate-900">
                                {task.clientName}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(task.status)}`}>
                                {task.status.replace('-', ' ').toUpperCase()}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {task.timeSlot}
                              </div>
                              <div>
                                <span className="font-medium">Vehicle:</span> {task.vehicleType}
                              </div>
                              <div>
                                <span className="font-medium">Date:</span> {new Date(task.appointmentDate).toLocaleDateString()}
                              </div>
                            </div>
                            {task.description && (
                              <p className="text-sm text-slate-600 italic">
                                Note: {task.description}
                              </p>
                            )}
                            
                            {/* 🆕 Estimated Completion Time Section */}
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Estimated Completion:
                                  </span>
                                </div>
                                
                                {editingEstimateId === task.id ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="time"
                                      value={estimateInput}
                                      onChange={(e) => setEstimateInput(e.target.value)}
                                      className="w-32 h-8 text-sm"
                                      placeholder="HH:MM"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => handleSetEstimatedCompletion(task.id, estimateInput)}
                                      disabled={updatingId === task.id}
                                      className="h-8 px-2"
                                    >
                                      <Save className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={cancelEditingEstimate}
                                      className="h-8 px-2"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                      {task.estimatedCompletion || (
                                        <span className="text-orange-600 font-medium">Not set</span>
                                      )}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => startEditingEstimate(task.id, task.estimatedCompletion)}
                                      className="h-8 px-2"
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {task.status === 'assigned' && (
                              <Button
                                onClick={() => handleUpdateStatus(task.id, 'in-progress')}
                                disabled={updatingId === task.id}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                {updatingId === task.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    Start
                                  </>
                                )}
                              </Button>
                            )}
                            {task.status === 'in-progress' && (
                              <Button
                                onClick={() => handleUpdateStatus(task.id, 'completed')}
                                disabled={updatingId === task.id}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                {updatingId === task.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Complete
                                  </>
                                )}
                              </Button>
                            )}
                            {task.status === 'completed' && (
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="h-5 w-5" />
                                <span className="font-medium">Completed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No tasks scheduled for today</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Tasks */}
            {upcomingTasks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Upcoming Tasks
                  </CardTitle>
                  <CardDescription>
                    {upcomingTasks.length} upcoming appointment{upcomingTasks.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 border rounded-lg bg-blue-50 border-blue-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900">{task.clientName}</h4>
                            <p className="text-sm text-slate-600">
                              {task.vehicleType} • {task.timeSlot} • {new Date(task.appointmentDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(task.status)}`}>
                            {task.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Past Tasks */}
            {pastTasks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Past Tasks
                  </CardTitle>
                  <CardDescription>
                    {pastTasks.length} completed or past appointment{pastTasks.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pastTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3 border rounded-lg bg-slate-50"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-slate-900">{task.clientName}</h4>
                            <p className="text-sm text-slate-600">
                              {task.vehicleType} • {task.timeSlot} • {new Date(task.appointmentDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(task.status)}`}>
                            {task.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
