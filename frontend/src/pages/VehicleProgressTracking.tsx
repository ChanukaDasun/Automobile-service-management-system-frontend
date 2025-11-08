import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Car, 
  Wrench, 
  ClipboardCheck,
  Package,
  AlertCircle,
  ArrowLeft,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceStage {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

interface VehicleProgress {
  appointmentId: string;
  vehicleType: string;
  serviceType: string;
  appointmentDate: string;
  timeSlot: string;
  overallStatus: 'pending' | 'in-progress' | 'completed';
  assignedEmployee?: string;
  stages: ServiceStage[];
  estimatedCompletion?: string;
  createdAt: string;
}

export default function VehicleProgressTracking() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [appointmentId, setAppointmentId] = useState<string>('');
  const [progress, setProgress] = useState<VehicleProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Fetch user's appointments on load
  useEffect(() => {
    fetchUserAppointments();
  }, [user]);

  const fetchUserAppointments = async () => {
    // TODO: Replace with actual API call to get user's appointments
    // const response = await fetch(`/api/appointments/user/${user?.id}`);
    // const data = await response.json();
    console.log('Fetching user appointments...');
  };

  const fetchProgress = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      setSearchAttempted(true);

      // Mock data - replace with actual API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockProgress: VehicleProgress = {
        appointmentId: id,
        vehicleType: 'Sedan',
        serviceType: 'Full Service',
        appointmentDate: new Date().toISOString().split('T')[0],
        timeSlot: '10:00 AM',
        overallStatus: 'in-progress',
        assignedEmployee: 'John Smith',
        estimatedCompletion: '2:30 PM',
        createdAt: new Date().toISOString(),
        stages: [
          {
            id: '1',
            name: 'Initial Inspection',
            description: 'Vehicle check-in and initial diagnostic',
            status: 'completed',
            completedAt: '10:15 AM',
            completedBy: 'John Smith',
            notes: 'Vehicle received in good condition'
          },
          {
            id: '2',
            name: 'Engine Diagnostics',
            description: 'Computer diagnostics and engine health check',
            status: 'completed',
            completedAt: '10:45 AM',
            completedBy: 'John Smith',
            notes: 'No error codes detected'
          },
          {
            id: '3',
            name: 'Oil & Filter Change',
            description: 'Replace engine oil and oil filter',
            status: 'in-progress',
            notes: 'Using synthetic oil as requested'
          },
          {
            id: '4',
            name: 'Brake Inspection',
            description: 'Check brake pads, rotors, and fluid',
            status: 'pending'
          },
          {
            id: '5',
            name: 'Tire Rotation',
            description: 'Rotate tires and check pressure',
            status: 'pending'
          },
          {
            id: '6',
            name: 'Final Quality Check',
            description: 'Complete inspection and road test',
            status: 'pending'
          }
        ]
      };

      setProgress(mockProgress);

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/appointments/${id}/progress`);
      // const data = await response.json();
      // setProgress(data);
    } catch (err) {
      setError('Failed to fetch progress. Please check the appointment ID.');
      setProgress(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (appointmentId.trim()) {
      fetchProgress(appointmentId.trim());
    }
  };

  const getStatusIcon = (status: ServiceStage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-6 w-6 text-blue-600 animate-pulse" />;
      case 'pending':
        return <Circle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ServiceStage['status']) => {
    const badges = {
      completed: 'bg-green-100 text-green-800 border-green-300',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
      pending: 'bg-gray-100 text-gray-600 border-gray-300',
    };
    return badges[status];
  };

  const calculateProgress = () => {
    if (!progress) return 0;
    const completed = progress.stages.filter(s => s.status === 'completed').length;
    return Math.round((completed / progress.stages.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/user')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Track Your Vehicle</h1>
            <p className="text-slate-600 mt-2">
              Stay informed in real-time as each maintenance stage is logged and verified.
            </p>
          </div>
          <Car className="h-16 w-16 text-blue-600 opacity-20" />
        </div>

        {/* Search Card */}
        <Card className="mb-8 shadow-lg border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Find Your Appointment
            </CardTitle>
            <CardDescription>
              Enter your appointment ID to track your vehicle's service progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="appointmentId">Appointment ID</Label>
                <Input
                  id="appointmentId"
                  type="text"
                  placeholder="e.g., APT-2025-001"
                  value={appointmentId}
                  onChange={(e) => setAppointmentId(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={loading || !appointmentId.trim()}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                >
                  {loading ? 'Searching...' : 'Track Progress'}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Display */}
        {loading && (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <Clock className="h-12 w-12 mx-auto text-blue-600 animate-spin mb-4" />
              <p className="text-slate-600">Loading progress information...</p>
            </CardContent>
          </Card>
        )}

        {!loading && progress && (
          <div className="space-y-6">
            {/* Overview Card */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ClipboardCheck className="h-6 w-6 text-blue-600" />
                    Service Overview
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    progress.overallStatus === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : progress.overallStatus === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {progress.overallStatus.toUpperCase()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Appointment ID</p>
                    <p className="font-semibold text-slate-900">{progress.appointmentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Vehicle Type</p>
                    <p className="font-semibold text-slate-900">{progress.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Service Type</p>
                    <p className="font-semibold text-slate-900">{progress.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Assigned Technician</p>
                    <p className="font-semibold text-slate-900">{progress.assignedEmployee || 'Not assigned'}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Appointment Date</p>
                    <p className="font-semibold text-slate-900">{progress.appointmentDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Time Slot</p>
                    <p className="font-semibold text-slate-900">{progress.timeSlot}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Est. Completion</p>
                    <p className="font-semibold text-slate-900">{progress.estimatedCompletion || 'TBD'}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-700">Overall Progress</p>
                    <p className="text-sm font-bold text-blue-600">{calculateProgress()}%</p>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-500"
                      style={{ width: `${calculateProgress()}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service Stages */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-6 w-6 text-blue-600" />
                  Service Stages
                </CardTitle>
                <CardDescription>
                  Real-time updates on each stage of your vehicle service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progress.stages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className={`relative flex gap-4 p-4 rounded-lg border transition-all ${
                        stage.status === 'completed'
                          ? 'bg-green-50 border-green-200'
                          : stage.status === 'in-progress'
                          ? 'bg-blue-50 border-blue-200 shadow-md'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {/* Connector Line */}
                      {index < progress.stages.length - 1 && (
                        <div
                          className={`absolute left-7 top-14 w-0.5 h-12 ${
                            stage.status === 'completed' ? 'bg-green-300' : 'bg-slate-300'
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div className="flex-shrink-0 relative z-10">
                        {getStatusIcon(stage.status)}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                              {stage.name}
                              {stage.status === 'in-progress' && (
                                <Wrench className="h-4 w-4 text-blue-600 animate-pulse" />
                              )}
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">{stage.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(stage.status)}`}>
                            {stage.status}
                          </span>
                        </div>

                        {/* Additional Info */}
                        {stage.status !== 'pending' && (
                          <div className="mt-3 space-y-1">
                            {stage.completedAt && (
                              <p className="text-xs text-slate-600">
                                <span className="font-medium">Completed:</span> {stage.completedAt}
                              </p>
                            )}
                            {stage.completedBy && (
                              <p className="text-xs text-slate-600">
                                <span className="font-medium">By:</span> {stage.completedBy}
                              </p>
                            )}
                            {stage.notes && (
                              <p className="text-xs text-slate-700 bg-white/60 p-2 rounded border border-slate-200 mt-2">
                                <span className="font-medium">Notes:</span> {stage.notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!loading && !progress && searchAttempted && !error && (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <Car className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Progress Found</h3>
              <p className="text-slate-600">
                We couldn't find any appointment with that ID. Please check and try again.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Initial State */}
        {!loading && !progress && !searchAttempted && (
          <Card className="shadow-lg border-2 border-dashed border-slate-300">
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to Track</h3>
              <p className="text-slate-600">
                Enter your appointment ID above to see real-time progress updates
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
