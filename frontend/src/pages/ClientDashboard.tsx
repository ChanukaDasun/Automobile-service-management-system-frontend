// src/pages/ClientDashboard.tsx
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
// import { useAuth } from "@clerk/clerk-react"; // 👈 Add this when implementing real API
import { useNavigate } from "react-router-dom";
import { getUserAppointments } from "@/api/appointmentApi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Clock, 
  Car, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  History,
  Plus,
  Send,
  Star,
  X
} from "lucide-react";

// Mock data interfaces
interface OngoingAppointment {
  id: string;
  clientId: string; // Added clientId to track user ownership
  vehicleType: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  status: 'assigned' | 'in-progress' | 'completed';
  employeeName: string;
  completedAt?: string; // Timestamp when service was completed
  createdAt?: string; // Timestamp when appointment was created
}



interface ChatMessage {
  id: string;
  appointmentId: string; // Link to specific appointment
  sender: 'client' | 'employee' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
}

interface AppointmentHistory {
  id: string;
  clientId: string; // Added clientId to track user ownership
  vehicleType: string;
  serviceType: string;
  date: string;
  timeSlot?: string; // Added for consistency
  status: 'completed' | 'cancelled';
  rating?: number;
  employeeName: string;
  cost: number;
  completedDate?: string; // When the service was actually completed
}

// Backend appointment data interface
interface BackendAppointment {
  appoinmentId?: string;
  id?: string;
  customerId?: string;
  customerName?: string;
  employeeId?: string;
  employeeName?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  vehicleType?: string;
  timeSlot?: string;
}

export default function ClientDashboard() {
  const { user } = useUser();
  // const { getToken } = useAuth(); // 👈 Add this when implementing real API
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [ongoingAppointments, setOngoingAppointments] = useState<OngoingAppointment[]>([]);
  const [appointmentHistory, setAppointmentHistory] = useState<AppointmentHistory[]>([]);
  
  // 🆕 API loading states
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);
  
  // 🆕 Rating modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingAppointment, setRatingAppointment] = useState<OngoingAppointment | AppointmentHistory | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  
  // 🆕 Appointment-specific chat state
  const [expandedChats, setExpandedChats] = useState<Record<string, boolean>>({});
  const [appointmentMessages, setAppointmentMessages] = useState<Record<string, string>>({});

  // 🆕 Refresh appointments function
  const refreshAppointments = async () => {
    const currentUserId = user?.id;
    if (!currentUserId) return;

    try {
      setAppointmentsLoading(true);
      setAppointmentsError(null);
      
      const appointmentsData = await getUserAppointments(currentUserId);
      const mappedAppointments: OngoingAppointment[] = appointmentsData.map((apt: BackendAppointment) => ({
        id: apt.appoinmentId || apt.id || '',
        clientId: apt.customerId || currentUserId,
        vehicleType: apt.vehicleType || 'Not specified',
        serviceType: apt.description || 'Service',
        date: apt.createdAt ? apt.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
        timeSlot: apt.timeSlot || 'TBD',
        status: apt.status?.toLowerCase().replace('_', '-') || 'pending',
        employeeName: apt.employeeName || 'Unassigned',
        completedAt: apt.status === 'COMPLETED' ? apt.updatedAt : undefined,
        createdAt: apt.createdAt
      }));
      
      setOngoingAppointments(mappedAppointments);
    } catch (error) {
      console.error('Error refreshing appointments:', error);
      setAppointmentsError('Failed to refresh appointments.');
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // USER-SPECIFIC DATA FILTERING:
  // This component now filters all data based on the current user's ID from Clerk
  // In a real application, you would replace the mock data with API calls like:
  // - GET /api/appointments?clientId=${user.id}
  // - GET /api/chat-messages?clientId=${user.id}
  // - GET /api/appointment-history?clientId=${user.id}

  // Real API data fetching (replace the mock data with these)
  useEffect(() => {
    const fetchUserData = async () => {
      // Get current user ID from Clerk
      const currentUserId = user?.id;
      
      // DEBUG: Log user information
      console.log('Current user from Clerk:', user);
      console.log('User ID for API call:', currentUserId);
      
      if (!currentUserId) return;

      try {
        // 🔄 REAL API IMPLEMENTATION:
        setAppointmentsLoading(true);
        setAppointmentsError(null);

        // 1. GET appointments for current user from backend
        const appointmentsData = await getUserAppointments(currentUserId);
        
        // DEBUG: Log the raw data from backend
        console.log('Raw appointments data from backend:', appointmentsData);
        console.log('Current user ID:', currentUserId);
        
        // Map backend data to frontend interface
        const mappedAppointments: OngoingAppointment[] = appointmentsData.map((apt: BackendAppointment) => ({
          id: apt.appoinmentId || apt.id,
          clientId: apt.customerId || currentUserId,
          vehicleType: apt.vehicleType || 'Not specified',
          serviceType: apt.description || 'Service',
          date: apt.createdAt ? apt.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          timeSlot: apt.timeSlot || 'TBD',
          status: apt.status?.toLowerCase().replace('_', '-') || 'pending',
          employeeName: apt.employeeName || 'Unassigned',
          completedAt: apt.status === 'COMPLETED' ? apt.updatedAt : undefined,
          createdAt: apt.createdAt
        }));
        
        // DEBUG: Log the mapped appointments
        console.log('Mapped appointments for display:', mappedAppointments);
        
        setOngoingAppointments(mappedAppointments);

        // 2. GET /api/chat-messages?clientId=${user.id}
        // Replace the mock chat messages array with:
        /*
        const chatResponse = await fetch(`/api/chat-messages?clientId=${currentUserId}`, {
          headers: {
            'Authorization': `Bearer ${await getToken()}`,
            'Content-Type': 'application/json'
          }
        });
        const chatData = await chatResponse.json();
        setChatMessages(chatData);
        */

        // CURRENT MOCK DATA (remove this when implementing real API):
        const mockChatMessages: ChatMessage[] = [
          {
            id: '1',
            appointmentId: '1',
            sender: 'employee',
            senderName: 'John Smith',
            message: 'Hi! I\'m starting work on your vehicle now. The oil change should take about 30 minutes.',
            timestamp: '10:15 AM'
          },
          {
            id: '2',
            appointmentId: '1',
            sender: 'client',
            senderName: user?.firstName || 'You',
            message: 'Great! Thanks for the update. Is everything looking good so far?',
            timestamp: '10:20 AM'
          },
          {
            id: '3',
            appointmentId: '1',
            sender: 'employee',
            senderName: 'John Smith',
            message: 'Yes, everything looks good. I also noticed your air filter needs replacement. Would you like me to replace it?',
            timestamp: '10:45 AM'
          }
        ];
        setChatMessages(mockChatMessages);

        // 4. GET /api/appointment-history?clientId=${user.id}
        // Replace the mock appointment history array with:
        /*
        const historyResponse = await fetch(`/api/appointment-history?clientId=${currentUserId}`, {
          headers: {
            'Authorization': `Bearer ${await getToken()}`,
            'Content-Type': 'application/json'
          }
        });
        const historyData = await historyResponse.json();
        setAppointmentHistory(historyData);
        */

        // CURRENT MOCK DATA (remove this when implementing real API):
        const mockAppointmentHistory: AppointmentHistory[] = [
          {
            id: '1',
            clientId: currentUserId,
            vehicleType: 'Sedan',
            serviceType: 'Regular Maintenance',
            date: '2025-10-15',
            status: 'completed',
            rating: 5,
            employeeName: 'Sarah Wilson',
            cost: 15000
          },
          {
            id: '2',
            clientId: currentUserId,
            vehicleType: 'Sedan',
            serviceType: 'Tire Rotation',
            date: '2025-09-20',
            status: 'completed',
            rating: 4,
            employeeName: 'Mike Johnson',
            cost: 8000
          }
        ];
        setAppointmentHistory(mockAppointmentHistory);

      } catch (error) {
        console.error('Error fetching user data:', error);
        setAppointmentsError('Failed to load appointments. Please try again.');
        // Fallback to empty arrays on error
        setOngoingAppointments([]);
        setAppointmentHistory([]);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Auto-move completed services to history after 1 hour
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      // Find services that have been completed for more than 1 hour
      const servicesToMove = ongoingAppointments.filter(appointment => {
        if (appointment.status === 'completed' && appointment.completedAt) {
          const completedTime = new Date(appointment.completedAt);
          const hoursPassed = (now.getTime() - completedTime.getTime()) / (1000 * 60 * 60);
          return hoursPassed >= 1;
        }
        return false;
      });

      if (servicesToMove.length > 0) {
        // Move to history
        const newHistoryItems: AppointmentHistory[] = servicesToMove.map(appointment => ({
          id: appointment.id,
          clientId: appointment.clientId,
          vehicleType: appointment.vehicleType,
          serviceType: appointment.serviceType,
          date: appointment.date,
          timeSlot: appointment.timeSlot,
          status: 'completed',
          employeeName: appointment.employeeName,
          completedDate: appointment.completedAt!,
          cost: 50, // Default cost - in real app this would come from the appointment
          rating: 0 // Default rating
        }));

        // Update state
        setAppointmentHistory(prev => [...newHistoryItems, ...prev]);
        setOngoingAppointments(prev => 
          prev.filter(app => !servicesToMove.some(moved => moved.id === app.id))
        );

        console.log(`Moved ${servicesToMove.length} completed services to history`);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [ongoingAppointments]);

  // 🆕 Submit rating function
  const submitRating = async () => {
    try {
      // TODO: Replace with actual API call
      console.log('Submitting rating:', { rating, feedback, appointmentId: ratingAppointment?.id });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Close modal and reset
      setShowRatingModal(false);
      setRating(0);
      setFeedback('');
      setRatingAppointment(null);
      
      // Show success message
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  // 🆕 Navigate to history tab
  const navigateToHistory = () => {
    setActiveTab('history');
  };

  // 🆕 Toggle appointment chat
  const toggleAppointmentChat = (appointmentId: string) => {
    setExpandedChats(prev => ({
      ...prev,
      [appointmentId]: !prev[appointmentId]
    }));
  };

  // 🆕 Send appointment-specific message
  const sendAppointmentMessage = (appointmentId: string) => {
    const message = appointmentMessages[appointmentId];
    if (message?.trim()) {
      const newChatMessage: ChatMessage = {
        id: Date.now().toString(),
        appointmentId: appointmentId,
        sender: 'client',
        senderName: user?.firstName || 'You',
        message: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      // Add message to appointment-specific chat messages
      setChatMessages(prev => [...prev, newChatMessage]);
      
      // Clear the input for this appointment
      setAppointmentMessages(prev => ({
        ...prev,
        [appointmentId]: ''
      }));
    }
  };

  // 🆕 Get messages for specific appointment
  const getAppointmentMessages = (appointmentId: string) => {
    return chatMessages.filter(msg => msg.appointmentId === appointmentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}!
              </h1>
              <p className="text-gray-600">
                Manage your vehicle services and appointments
                {user?.id && (
                  <span className="text-sm text-gray-400 ml-2">
                    • ID: {user.id.slice(-8)}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/appointment')}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Book New Appointment
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 border-b">
            {[
              { id: 'overview', label: 'Overview', icon: <Car className="h-4 w-4" /> },
              { id: 'progress', label: 'Progress', icon: <Clock className="h-4 w-4" /> },
              { id: 'history', label: 'History', icon: <History className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setActiveTab('progress')}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ongoing Services</CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{ongoingAppointments.length}</div>
                    <p className="text-xs text-muted-foreground">Active appointments</p>
                  </CardContent>
                </Card>
                
                <Card 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigateToHistory()}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{appointmentHistory.length}</div>
                    <p className="text-xs text-muted-foreground">This year</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest service updates</CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={refreshAppointments}
                      disabled={appointmentsLoading}
                      className="h-8 w-8 p-0"
                    >
                      <div className={appointmentsLoading ? 'animate-spin' : ''}>
                        🔄
                      </div>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointmentsLoading ? (
                      <div className="text-center py-6">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading appointments...</p>
                      </div>
                    ) : appointmentsError ? (
                      <div className="text-center py-6">
                        <AlertCircle className="h-8 w-8 text-red-300 mx-auto mb-2" />
                        <p className="text-sm text-red-500">{appointmentsError}</p>
                        <button 
                          onClick={() => window.location.reload()} 
                          className="text-xs text-blue-600 hover:underline mt-1"
                        >
                          Try again
                        </button>
                      </div>
                    ) : ongoingAppointments.length > 0 ? (
                      ongoingAppointments
                        .sort((a, b) => {
                          // Sort by created time (newest first)
                          const timeA = new Date(a.createdAt || a.date || '').getTime();
                          const timeB = new Date(b.createdAt || b.date || '').getTime();
                          return timeB - timeA; // Descending order (newest first)
                        })
                        .slice(0, 3)
                        .map((appointment) => (
                        <div key={appointment.id} className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getStatusIcon(appointment.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {appointment.serviceType} - {appointment.vehicleType}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointment.employeeName} • {appointment.date} at {appointment.timeSlot}
                            </p>
                          </div>
                          <div className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status.replace('-', ' ')}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No active services at the moment</p>
                        <p className="text-xs text-gray-400">Your recent activity will appear here</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Appointments</h2>
              <Button 
                variant="outline" 
                onClick={refreshAppointments}
                disabled={appointmentsLoading}
                className="flex items-center gap-2"
              >
                <div className={appointmentsLoading ? 'animate-spin' : ''}>
                  🔄
                </div>
                Refresh
              </Button>
            </div>
            
            {appointmentsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading your appointments...</p>
              </div>
            ) : appointmentsError ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
                <p className="text-red-500 mb-2">{appointmentsError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-blue-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : ongoingAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found</p>
                <p className="text-sm text-gray-400">Your appointments will appear here</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {ongoingAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Car className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{appointment.serviceType}</h3>
                          <p className="text-gray-600">{appointment.vehicleType}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.date} at {appointment.timeSlot}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-2">{appointment.status.replace('-', ' ')}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Mechanic: {appointment.employeeName}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Service Progress</h2>
            
            {ongoingAppointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{appointment.serviceType}</h3>
                        <p className="text-gray-600">{appointment.vehicleType} • {appointment.employeeName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAppointmentChat(appointment.id)}
                          className="flex items-center space-x-1"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Chat</span>
                        </Button>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status.replace('-', ' ')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Started: {appointment.timeSlot}</span>
                    </div>

                    {/* Appointment-specific Chat Section */}
                    {expandedChats[appointment.id] && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="text-sm font-medium mb-3">Chat with {appointment.employeeName}</h4>
                        
                        {/* Chat Messages */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-3 max-h-48 overflow-y-auto">
                          {getAppointmentMessages(appointment.id).length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-4">
                              No messages yet. Start a conversation with your service technician.
                            </p>
                          ) : (
                            <div className="space-y-2">
                              {getAppointmentMessages(appointment.id).map((message) => (
                                <div 
                                  key={message.id}
                                  className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                    message.sender === 'client' 
                                      ? 'bg-blue-600 text-white' 
                                      : 'bg-white text-gray-900 border'
                                  }`}>
                                    <p className="font-medium text-xs opacity-75">{message.senderName}</p>
                                    <p>{message.message}</p>
                                    <p className={`text-xs mt-1 ${
                                      message.sender === 'client' ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                      {message.timestamp}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Message Input */}
                        <div className="flex space-x-2">
                          <Input
                            value={appointmentMessages[appointment.id] || ''}
                            onChange={(e) => setAppointmentMessages(prev => ({
                              ...prev,
                              [appointment.id]: e.target.value
                            }))}
                            placeholder="Type your message..."
                            onKeyPress={(e) => e.key === 'Enter' && sendAppointmentMessage(appointment.id)}
                            className="text-sm"
                          />
                          <Button 
                            onClick={() => sendAppointmentMessage(appointment.id)}
                            size="sm"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Appointment History</h2>
            </div>
            
            <div className="space-y-4">
              {appointmentHistory.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{appointment.serviceType}</h3>
                          <p className="text-gray-600">{appointment.vehicleType}</p>
                          <p className="text-sm text-gray-500">
                            {appointment.date} • {appointment.employeeName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${
                                i < (appointment.rating || 0) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-lg font-semibold">Rs. {appointment.cost}</p>
                        <p className="text-sm text-gray-500">Total Cost</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🆕 Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rate Your Service</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowRatingModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {ratingAppointment && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium">{ratingAppointment.serviceType}</p>
                <p className="text-sm text-gray-600">{ratingAppointment.vehicleType} • {ratingAppointment.employeeName}</p>
              </div>
            )}
            
            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How was your experience?
              </label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(star => (
                  <Star 
                    key={star}
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                      rating >= star 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300 hover:text-yellow-300'
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            
            {/* Feedback Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments (Optional)
              </label>
              <textarea 
                placeholder="Share your thoughts about the service..."
                className="w-full p-3 border rounded-lg resize-none"
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowRatingModal(false)}
              >
                Skip
              </Button>
              <Button 
                className="flex-1"
                onClick={submitRating}
                disabled={rating === 0}
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}