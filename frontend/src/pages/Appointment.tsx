import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DailyAvailability, VehicleType } from '@/types/appointment';
import { Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Appointment() {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('');
  const [availability, setAvailability] = useState<DailyAvailability | null>(null);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fetch vehicle types on component mount
  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  // Fetch availability when date or vehicle type changes
  useEffect(() => {
    if (selectedDate && vehicleType) {
      fetchAvailability(selectedDate, vehicleType);
    } else {
      setAvailability(null);
      setSelectedTimeSlot('');
    }
  }, [selectedDate, vehicleType]);

  const fetchVehicleTypes = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockVehicleTypes: VehicleType[] = [
        { id: '1', name: 'CAR', serviceTime: 60 },
        { id: '2', name: 'VAN', serviceTime: 90 },
        { id: '3', name: 'TRUCK', serviceTime: 120 },
        { id: '4', name: 'Motorcycle', serviceTime: 45 },
      ];
      setVehicleTypes(mockVehicleTypes);
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/vehicle-types');
      // const data = await response.json();
      // setVehicleTypes(data);
    } catch (error) {
      console.error('Error fetching vehicle types:', error);
      setError('Failed to load vehicle types');
    }
  };

  const fetchAvailability = async (date: string, _vehicleTypeId: string) => {
    try {
      setLoading(true);
      setError('');
      
      // Mock data for now - replace with actual API call
      // TODO: Use vehicleTypeId in API call: `/api/appointments/availability?date=${date}&vehicleType=${_vehicleTypeId}`
      const mockAvailability: DailyAvailability = {
        date: date,
        totalSlots: 10,
        bookedSlots: Math.floor(Math.random() * 10),
        remainingSlots: 0,
        limitReached: false,
        timeSlots: [
          { time: '09:00 AM', available: true },
          { time: '10:00 AM', available: true },
          { time: '11:00 AM', available: false, appointmentId: 'xxx' },
          { time: '12:00 PM', available: true },
          { time: '02:00 PM', available: true },
          { time: '03:00 PM', available: false, appointmentId: 'yyy' },
          { time: '04:00 PM', available: true },
          { time: '05:00 PM', available: true },
        ],
      };
      
      // Calculate remaining slots based on available time slots
      const availableCount = mockAvailability.timeSlots.filter(slot => slot.available).length;
      mockAvailability.remainingSlots = availableCount;
      mockAvailability.limitReached = availableCount === 0;
      
      setAvailability(mockAvailability);
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/appointments/availability?date=${date}&vehicleType=${vehicleTypeId}`);
      // const data = await response.json();
      // setAvailability(data);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setError('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !vehicleType || !selectedTimeSlot) {
      setError('Please select all required fields');
      return;
    }

    if (!user) {
      setError('You must be logged in to book an appointment');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // TODO: Replace with actual API call
      const appointmentData = {
        clientId: user.id,
        clientName: `${user.firstName} ${user.lastName}`,
        appointmentDate: selectedDate,
        timeSlot: selectedTimeSlot,
        vehicleType: vehicleTypes.find(vt => vt.id === vehicleType)?.name || '',
        status: 'pending',
      };
      
      console.log('Booking appointment:', appointmentData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // const response = await fetch('/api/appointments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(appointmentData),
      // });

      // if (response.ok) {
        setBookingSuccess(true);
        setSelectedTimeSlot('');
        
        // Refresh availability
        if (selectedDate && vehicleType) {
          fetchAvailability(selectedDate, vehicleType);
        }
        
        // Reset success message after 3 seconds
        setTimeout(() => setBookingSuccess(false), 3000);
      // } else {
      //   const error = await response.json();
      //   setError(error.message || 'Failed to book appointment');
      // }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Book Your Appointment</h1>
          <p className="text-slate-600">Select a date and time slot for your vehicle service</p>
        </div>

        {/* Success Message */}
        {bookingSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">Appointment booked successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Selection Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Select Date & Vehicle
              </CardTitle>
              <CardDescription>Choose your preferred service date and vehicle type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="vehicle-type">Vehicle Type *</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger id="vehicle-type">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((vt) => (
                      <SelectItem key={vt.id} value={vt.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{vt.name}</span>
                          {vt.description && (
                            <span className="text-xs text-slate-500">{vt.description}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label htmlFor="appointment-date">Appointment Date *</Label>
                <Input
                  id="appointment-date"
                  type="date"
                  min={getMinDate()}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Important Information</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Appointments are subject to availability</li>
                  <li>• Daily appointment limits apply</li>
                  <li>• Please arrive 10 minutes early</li>
                  <li>• Cancellations require 24-hour notice</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Available Time Slots Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Available Time Slots
              </CardTitle>
              <CardDescription>
                {availability 
                  ? `${availability.remainingSlots} of ${availability.totalSlots} slots available`
                  : 'Select date and vehicle type to view available slots'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : availability ? (
                <div className="space-y-4">
                  {/* Availability Status */}
                  <div className={`p-3 rounded-lg ${
                    availability.limitReached 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <p className="text-sm font-medium">
                      <span className={availability.limitReached ? 'text-red-700' : 'text-green-700'}>
                        {availability.limitReached 
                          ? '❌ Daily limit reached - No slots available' 
                          : `✓ ${availability.remainingSlots} slots remaining`}
                      </span>
                    </p>
                    <p className="text-xs mt-1 text-slate-600">
                      Date: {new Date(availability.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>

                  {/* Time Slots Grid */}
                  {!availability.limitReached && availability.timeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {availability.timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTimeSlot === slot.time ? 'default' : 'outline'}
                          disabled={!slot.available}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={`w-full h-auto py-3 ${
                            !slot.available 
                              ? 'opacity-50 cursor-not-allowed' 
                              : selectedTimeSlot === slot.time 
                                ? 'bg-blue-600 hover:bg-blue-700' 
                                : 'hover:bg-blue-50'
                          }`}
                        >
                          <div className="flex flex-col items-center">
                            <Clock className="h-4 w-4 mb-1" />
                            <span className="font-semibold">{slot.time}</span>
                            {!slot.available && (
                              <span className="text-xs mt-1">Booked</span>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : availability.limitReached ? (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                      <p className="text-red-600 font-medium">No slots available for this date</p>
                      <p className="text-sm text-slate-600 mt-2">Please select a different date</p>
                    </div>
                  ) : (
                    <p className="text-center text-slate-500 py-8">No time slots available</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Select a date and vehicle type to view available slots</p>
                </div>
              )}

              {/* Book Button - Always visible at the bottom */}
              <div className="mt-4">
                <Button 
                  onClick={handleBookAppointment} 
                  disabled={!selectedDate || !vehicleType || !selectedTimeSlot || loading}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Quality Service</h4>
                  <p className="text-sm text-slate-600">Professional mechanics with years of experience</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Timely Service</h4>
                  <p className="text-sm text-slate-600">Service completed within scheduled time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Real-time Updates</h4>
                  <p className="text-sm text-slate-600">Track your service progress live</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
