import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DailyAvailability, VehicleType } from '@/types/appointment';
import { Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createAppointment } from "@/api/appointmentApi";

// Appointment Types
const appointmentTypes = [
  {
    id: 'basic',
    name: 'Basic Service',
    price: 'Rs.5,000',
    features: ['Standard cleaning', 'Basic inspection', 'Oil check']
  },
  {
    id: 'standard',
    name: 'Standard Service',
    price: 'Rs.10,000',
    features: ['Deep cleaning', 'Full inspection', 'Oil change', 'Filter replacement']
  },
  {
    id: 'premium',
    name: 'Premium Service',
    price: 'Rs.20,000',
    features: ['Complete detailing', 'Comprehensive inspection', 'Oil change', 'All filters', 'Tire rotation']
  }
];

export default function Appointment() {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('');
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
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

  const handleBookAppointment = async () => {
    if (!selectedDate || !vehicleType || !appointmentType) {
      setError("Please select all required fields");
      return;
    }

    if (!user) {
      setError("You must be logged in to book an appointment");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const appointmentData = {
        customerId: user.id,
        vehicleType: vehicleTypes.find(vt => vt.id === vehicleType)?.name || "",
        date: selectedDate,
        appointmentType: appointmentTypes.find(at => at.id === appointmentType)?.name || "",
        status: "pending",
      };

      const response = await createAppointment(appointmentData);

      console.log("✅ Appointment created:", response);
      setBookingSuccess(true);
      setAppointmentType("");

      setTimeout(() => setBookingSuccess(false), 3000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Your Appointment</h1>
          <p className="text-gray-600">Select a date and service type for your vehicle</p>
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
          <Card className="shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-700" />
                Appointment Details
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
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Important Information</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Appointments are subject to availability</li>
                  <li>• Please arrive 10 minutes early</li>
                  <li>• Cancellations require 24-hour notice</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Appointment Type Selection Card */}
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Select Service Type</CardTitle>
              <CardDescription>
                Choose the service package that best fits your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointmentTypes.map((type) => {
                  const isSelected = appointmentType === type.id;
                  
                  return (
                    <div
                      key={type.id}
                      onClick={() => setAppointmentType(type.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg text-gray-900">{type.name}</h3>
                        <span className="font-bold text-lg text-gray-900">{type.price}</span>
                      </div>
                      <ul className="space-y-2">
                        {type.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Book Button */}
              <div className="mt-6">
                <Button 
                  onClick={handleBookAppointment} 
                  disabled={!selectedDate || !vehicleType || !appointmentType || loading}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? 'Booking...' : 'Book Appointment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="mt-6 shadow">
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Professional Service</h4>
                  <p className="text-sm text-gray-600">Experienced technicians and quality parts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Flexible Scheduling</h4>
                  <p className="text-sm text-gray-600">Multiple service packages to choose from</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-5 w-5 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Timely Completion</h4>
                  <p className="text-sm text-gray-600">Service completed as scheduled</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
