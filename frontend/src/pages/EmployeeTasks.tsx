import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Appointment } from '@/types/appointment';
import { Calendar, Clock, CheckCircle2, AlertCircle, Car, Play, Check } from 'lucide-react';

export default function EmployeeTasks() {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      // Mock data - replace with actual API call
      const mockTasks: Appointment[] = [
        {
          id: '1',
          clientId: 'user_123',
          clientName: 'John Doe',
          vehicleType: 'Sedan',
          appointmentDate: new Date().toISOString().split('T')[0],
          timeSlot: '09:00 AM',
          status: 'assigned',
          assignedEmployeeId: user?.id,
          assignedEmployeeName: `${user?.firstName} ${user?.lastName}`,
          description: 'Oil change and tire rotation',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          clientId: 'user_456',
          clientName: 'Jane Smith',
          vehicleType: 'SUV',
          appointmentDate: new Date().toISOString().split('T')[0],
          timeSlot: '11:00 AM',
          status: 'assigned',
          assignedEmployeeId: user?.id,
          assignedEmployeeName: `${user?.firstName} ${user?.lastName}`,
          description: 'Full service inspection',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          clientId: 'user_789',
          clientName: 'Bob Wilson',
          vehicleType: 'Truck',
          appointmentDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          timeSlot: '02:00 PM',
          status: 'in-progress',
          assignedEmployeeId: user?.id,
          assignedEmployeeName: `${user?.firstName} ${user?.lastName}`,
          description: 'Brake service',
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          clientId: 'user_321',
          clientName: 'Alice Brown',
          vehicleType: 'Motorcycle',
          appointmentDate: new Date(Date.now() - 172800000).toISOString().split('T')[0],
          timeSlot: '10:00 AM',
          status: 'completed',
          assignedEmployeeId: user?.id,
          assignedEmployeeName: `${user?.firstName} ${user?.lastName}`,
          description: 'Chain adjustment and oil change',
          createdAt: new Date().toISOString(),
        },
      ];

      setTasks(mockTasks);

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/employee/tasks?employeeId=${user?.id}`);
      // const data = await response.json();
      // setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId: string, newStatus: Appointment['status']) => {
    try {
      setUpdatingId(taskId);

      console.log('Updating task status:', { taskId, newStatus });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/employee/tasks/${taskId}/status`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus }),
      // });
      // if (response.ok) {
      //   const updated = await response.json();
      //   setTasks(prev => prev.map(task => task.id === taskId ? updated : task));
      // }
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setUpdatingId(null);
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

  const stats = {
    total: tasks.length,
    assigned: tasks.filter(t => t.status === 'assigned').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const todayTasks = tasks.filter(
    t => t.appointmentDate === new Date().toISOString().split('T')[0]
  );

  const upcomingTasks = tasks.filter(
    t => new Date(t.appointmentDate) > new Date() && t.status !== 'completed' && t.status !== 'cancelled'
  );

  const pastTasks = tasks.filter(
    t => new Date(t.appointmentDate) < new Date() || t.status === 'completed'
  );

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
