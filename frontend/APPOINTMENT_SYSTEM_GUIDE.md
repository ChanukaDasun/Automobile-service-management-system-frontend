# 🚗 Appointment System Implementation Guide

## 📋 Overview

This document explains the complete appointment system for your Automobile Service Management application with three role-based workflows.

---

## 🎯 Features by Role

### 1. **Client (User Role)**
- ✅ View available appointment slots by date and vehicle type
- ✅ Check daily appointment limits (system-wide and per vehicle type)
- ✅ Book appointments with service details
- ✅ Real-time slot availability updates
- ✅ Validation to prevent overbooking

### 2. **Admin**
- ✅ View all appointments filtered by date
- ✅ See appointment statistics (total, pending, in-progress, completed)
- ✅ Assign available employees to appointments
- ✅ Group appointments by time slots for better organization
- ✅ Real-time assignment updates

### 3. **Employee**
- ✅ View assigned tasks/appointments
- ✅ Filter tasks by status (assigned, in-progress, completed)
- ✅ Update task status (start work, mark complete)
- ✅ See customer details and service requirements
- ✅ Task statistics dashboard

---

## 📁 Files Created

### Type Definitions
- `src/types/appointment.ts` - All appointment-related TypeScript types

### API Client
- `src/lib/api.ts` - API client functions for appointment operations

### Pages
- `src/pages/ClientAppointments.tsx` - Client booking interface
- `src/pages/AdminAppointments.tsx` - Admin management interface
- `src/pages/EmployeeTasks.tsx` - Employee task management

---

## 🔌 Backend API Endpoints Required

You need to implement these endpoints in your backend:

### Client Endpoints
```
GET  /api/appointments/daily-limit?date=YYYY-MM-DD
     Response: { date, totalAppointments, maxAppointments, canBookMore, vehicleLimits }

GET  /api/appointments/available-slots?date=YYYY-MM-DD&vehicleType=car
     Response: [{ time, available, remainingSlots }]

POST /api/appointments
     Body: { vehicleType, date, timeSlot, serviceType, description }
     Response: Appointment object
```

### Admin Endpoints
```
GET   /api/appointments?date=YYYY-MM-DD
      Response: Appointment[]

PATCH /api/appointments/:id/assign
      Body: { employeeId, employeeName }
      Response: Updated Appointment
```

### Employee Endpoints
```
GET   /api/appointments/employee/:employeeId
      Response: Appointment[]

PATCH /api/appointments/:id/status
      Body: { status: 'in-progress' | 'completed' }
      Response: Updated Appointment
```

---

## 🔧 Configuration Steps

### 1. Update Environment Variables

Create or update `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Update App.tsx Routes

Add these routes to your `App.tsx`:

```tsx
import ClientAppointments from './pages/ClientAppointments';
import AdminAppointments from './pages/AdminAppointments';
import EmployeeTasks from './pages/EmployeeTasks';

// In your routes:
<Route path="/appointments" element={<ClientAppointments />} />
<Route path="/admin/appointments" element={<AdminAppointments />} />
<Route path="/employee/tasks" element={<EmployeeTasks />} />
```

### 3. Update Navigation (Navbar.tsx)

Add navigation links based on user role:

```tsx
import { useUser } from '@clerk/clerk-react';

function Navbar() {
  const { user } = useUser();
  const role = user?.publicMetadata?.role;

  return (
    <nav>
      {role === 'user' && (
        <Link to="/appointments">My Appointments</Link>
      )}
      {role === 'admin' && (
        <Link to="/admin/appointments">Manage Appointments</Link>
      )}
      {role === 'employee' && (
        <Link to="/employee/tasks">My Tasks</Link>
      )}
    </nav>
  );
}
```

---

## 🎨 Business Logic Details

### Daily Limits

The system enforces two types of limits:

1. **Global Daily Limit**: Total appointments per day (e.g., 50)
2. **Vehicle-Type Limits**: Per vehicle type per day (e.g., 20 cars, 10 trucks)

Example daily limit response:
```json
{
  "date": "2025-11-05",
  "totalAppointments": 35,
  "maxAppointments": 50,
  "canBookMore": true,
  "vehicleLimits": {
    "car": { "current": 15, "max": 20, "available": true },
    "truck": { "current": 8, "max": 10, "available": true },
    "suv": { "current": 12, "max": 15, "available": true }
  }
}
```

### Time Slots

Generate time slots in your backend (example):
```javascript
// 9 AM to 5 PM, 1-hour slots
const timeSlots = [
  "09:00-10:00", "10:00-11:00", "11:00-12:00",
  "12:00-13:00", "13:00-14:00", "14:00-15:00",
  "15:00-16:00", "16:00-17:00"
];
```

For each slot, calculate:
- Total bookings for that slot
- Available slots remaining (e.g., 3 appointments per slot)
- Filter by vehicle type

### Appointment Status Flow

```
pending → assigned → in-progress → completed
              ↓
          cancelled
```

- **pending**: Just created, no employee assigned
- **assigned**: Admin assigned an employee
- **in-progress**: Employee started work
- **completed**: Service finished
- **cancelled**: Appointment cancelled

---

## 🔐 Authentication & Authorization

The system uses Clerk for authentication. Make sure:

1. **Token Management**: Update `src/lib/api.ts` to get the Clerk token correctly:

```typescript
import { useAuth } from '@clerk/clerk-react';

// In your component:
const { getToken } = useAuth();
const token = await getToken();
```

2. **Backend Validation**: Verify JWT tokens in your backend endpoints

3. **Role-Based Access**: Each endpoint should validate user roles

---

## 📱 UI/UX Features

### Client Page
- Date picker (min: today)
- Visual vehicle type selector
- Time slot grid with availability indicators
- Service dropdown
- Real-time validation feedback
- Success/error notifications

### Admin Page
- Date filter
- Statistics dashboard
- Appointments grouped by time slots
- Employee assignment dropdown
- Status badges
- Optimistic UI updates

### Employee Page
- Task statistics
- Status filter buttons
- Card-based task layout
- Quick action buttons (Start/Complete)
- Task details with customer info

---

## 🧪 Testing Checklist

### Client Flow
- [ ] Book appointment when slots available
- [ ] Prevent booking when daily limit reached
- [ ] Prevent booking when vehicle limit reached
- [ ] Validate required fields
- [ ] Show appropriate error messages
- [ ] Refresh available slots after booking

### Admin Flow
- [ ] View all appointments for selected date
- [ ] Filter appointments correctly
- [ ] Assign employee to appointment
- [ ] Update UI optimistically
- [ ] Handle assignment errors gracefully
- [ ] Display correct statistics

### Employee Flow
- [ ] View only assigned tasks
- [ ] Filter tasks by status
- [ ] Start work on assigned task
- [ ] Complete in-progress task
- [ ] Update status successfully
- [ ] Handle errors appropriately

---

## 🚀 Deployment Notes

### Environment Variables
- Set `VITE_API_BASE_URL` to your production API URL
- Configure Clerk production keys

### Backend Requirements
- Implement all required API endpoints
- Set up database schema for appointments
- Configure CORS for frontend domain
- Implement proper error handling
- Add request validation
- Set up logging

### Database Schema (Example)
```sql
CREATE TABLE appointments (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  user_name VARCHAR NOT NULL,
  user_email VARCHAR NOT NULL,
  vehicle_type VARCHAR NOT NULL,
  date DATE NOT NULL,
  time_slot VARCHAR NOT NULL,
  service_type VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR NOT NULL DEFAULT 'pending',
  assigned_employee_id VARCHAR,
  assigned_employee_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_employee ON appointments(assigned_employee_id);
CREATE INDEX idx_appointments_user ON appointments(user_id);
```

---

## 🎯 Optional Enhancements

### Phase 2 Features
- [ ] Email notifications when appointment assigned
- [ ] SMS reminders for appointments
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Appointment rescheduling
- [ ] Customer reviews/ratings after service
- [ ] Employee availability calendar
- [ ] Real-time updates with WebSockets
- [ ] Appointment history page
- [ ] Export appointments to PDF/CSV
- [ ] Analytics dashboard for admin

### Performance Optimizations
- [ ] Implement caching for available slots
- [ ] Add pagination for appointment lists
- [ ] Use React Query for data fetching
- [ ] Implement optimistic updates everywhere
- [ ] Add loading skeletons
- [ ] Lazy load appointment details

### UI Improvements
- [ ] Add animation transitions
- [ ] Implement dark mode
- [ ] Make fully responsive for mobile
- [ ] Add accessibility features (ARIA labels, keyboard navigation)
- [ ] Add print-friendly appointment details

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Verify API endpoint responses
3. Ensure Clerk authentication is working
4. Check network tab for failed requests
5. Validate backend is running and accessible

---

## 📝 Summary

You now have a complete appointment system with:
- ✅ Client booking with validation
- ✅ Admin assignment capabilities
- ✅ Employee task management
- ✅ Type-safe API client
- ✅ Role-based access control
- ✅ Modern, responsive UI

**Next Steps:**
1. Update your App.tsx with new routes
2. Implement backend API endpoints
3. Test each user flow thoroughly
4. Deploy and monitor
