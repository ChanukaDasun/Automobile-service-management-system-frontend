# Appointment System API Documentation

## Overview
This document describes the API endpoints needed for the Appointment Management System.

## Base URL
```
https://your-api-domain.com/api
```

## Authentication
All API calls should include authentication headers (e.g., JWT token from Clerk):
```
Authorization: Bearer {token}
```

---

## Client Endpoints

### 1. Get Vehicle Types
**GET** `/vehicle-types`

Returns list of available vehicle types for service booking.

**Response:**
```json
[
  {
    "id": "1",
    "name": "Sedan",
    "description": "Regular car service",
    "serviceTime": 60
  },
  {
    "id": "2",
    "name": "SUV",
    "description": "SUV service",
    "serviceTime": 90
  }
]
```

---

### 2. Check Availability
**GET** `/appointments/availability`

Check available time slots for a specific date and vehicle type.

**Query Parameters:**
- `date` (string, required): Date in YYYY-MM-DD format
- `vehicleType` (string, required): Vehicle type ID

**Example:**
```
GET /appointments/availability?date=2025-11-15&vehicleType=1
```

**Response:**
```json
{
  "date": "2025-11-15",
  "totalSlots": 10,
  "bookedSlots": 3,
  "remainingSlots": 7,
  "limitReached": false,
  "timeSlots": [
    {
      "time": "09:00 AM",
      "available": true
    },
    {
      "time": "10:00 AM",
      "available": false,
      "appointmentId": "appt-123"
    },
    {
      "time": "11:00 AM",
      "available": true
    }
  ]
}
```

**Business Rules:**
- Daily limit check: If `bookedSlots >= totalSlots`, set `limitReached: true`
- Only return available dates (today or future)
- Consider vehicle type when calculating available slots

---

### 3. Book Appointment
**POST** `/appointments`

Create a new appointment booking.

**Request Body:**
```json
{
  "clientId": "user_abc123",
  "clientName": "John Doe",
  "appointmentDate": "2025-11-15",
  "timeSlot": "09:00 AM",
  "vehicleType": "Sedan",
  "description": "Regular maintenance" // optional
}
```

**Response (Success - 201):**
```json
{
  "id": "appt-456",
  "clientId": "user_abc123",
  "clientName": "John Doe",
  "appointmentDate": "2025-11-15",
  "timeSlot": "09:00 AM",
  "vehicleType": "Sedan",
  "status": "pending",
  "createdAt": "2025-11-01T10:30:00Z"
}
```

**Response (Error - 400):**
```json
{
  "error": "Daily limit reached",
  "message": "No more appointments available for this date"
}
```

**Validation Rules:**
- Check if time slot is still available
- Verify daily limit not exceeded
- Ensure date is not in the past
- Validate all required fields

---

## Admin Endpoints

### 4. Get All Appointments
**GET** `/admin/appointments`

Get all appointments, optionally filtered by date.

**Query Parameters:**
- `date` (string, optional): Filter by specific date (YYYY-MM-DD)
- `status` (string, optional): Filter by status (pending, assigned, completed, cancelled)

**Example:**
```
GET /admin/appointments?date=2025-11-15&status=pending
```

**Response:**
```json
[
  {
    "id": "appt-456",
    "clientId": "user_abc123",
    "clientName": "John Doe",
    "appointmentDate": "2025-11-15",
    "timeSlot": "09:00 AM",
    "vehicleType": "Sedan",
    "status": "pending",
    "assignedEmployeeId": null,
    "assignedEmployeeName": null,
    "createdAt": "2025-11-01T10:30:00Z"
  }
]
```

---

### 5. Get Available Employees
**GET** `/employees/available`

Get list of employees available for assignment.

**Query Parameters:**
- `date` (string, optional): Check availability for specific date

**Response:**
```json
[
  {
    "id": "emp-123",
    "name": "Mike Johnson",
    "available": true,
    "currentAssignments": 2,
    "maxAssignments": 5
  },
  {
    "id": "emp-456",
    "name": "Sarah Smith",
    "available": false,
    "currentAssignments": 5,
    "maxAssignments": 5
  }
]
```

---

### 6. Assign Employee to Appointment
**POST** `/admin/appointments/{appointmentId}/assign`

Assign an employee to a specific appointment.

**Path Parameters:**
- `appointmentId` (string): The appointment ID

**Request Body:**
```json
{
  "employeeId": "emp-123"
}
```

**Response (Success - 200):**
```json
{
  "id": "appt-456",
  "clientId": "user_abc123",
  "clientName": "John Doe",
  "appointmentDate": "2025-11-15",
  "timeSlot": "09:00 AM",
  "vehicleType": "Sedan",
  "status": "assigned",
  "assignedEmployeeId": "emp-123",
  "assignedEmployeeName": "Mike Johnson",
  "updatedAt": "2025-11-01T11:00:00Z"
}
```

**Validation Rules:**
- Check if employee is available
- Verify appointment is in 'pending' status
- Update appointment status to 'assigned'

---

## Employee Endpoints

### 7. Get Employee Tasks
**GET** `/employee/tasks`

Get all tasks/appointments assigned to the logged-in employee.

**Query Parameters:**
- `status` (string, optional): Filter by status (assigned, in-progress, completed)

**Response:**
```json
[
  {
    "id": "appt-456",
    "clientName": "John Doe",
    "appointmentDate": "2025-11-15",
    "timeSlot": "09:00 AM",
    "vehicleType": "Sedan",
    "status": "assigned",
    "description": "Regular maintenance",
    "assignedAt": "2025-11-01T11:00:00Z"
  }
]
```

---

### 8. Update Task Status
**PATCH** `/employee/tasks/{taskId}`

Update the status of an assigned task.

**Path Parameters:**
- `taskId` (string): The appointment/task ID

**Request Body:**
```json
{
  "status": "in-progress" // or "completed"
}
```

**Response:**
```json
{
  "id": "appt-456",
  "status": "in-progress",
  "updatedAt": "2025-11-15T09:15:00Z"
}
```

**Allowed Status Transitions:**
- `assigned` → `in-progress`
- `in-progress` → `completed`

---

## Status Flow

```
pending → assigned → in-progress → completed
                                  ↘ cancelled
```

1. **pending**: Appointment booked by client, awaiting admin assignment
2. **assigned**: Admin assigned an employee to the appointment
3. **in-progress**: Employee started working on the service
4. **completed**: Service completed
5. **cancelled**: Appointment cancelled by client or admin

---

## Daily Limit Logic

The system should enforce daily appointment limits:

1. **Configuration**: Set a `maxAppointmentsPerDay` value (e.g., 10)
2. **Check on Booking**: Before accepting a new appointment:
   - Count existing appointments for that date
   - If count >= limit, return error
3. **Vehicle Type Consideration**: Optionally, have different limits per vehicle type
4. **Time Slot Management**: Generate time slots based on business hours and service duration

**Example Logic:**
```javascript
const maxAppointmentsPerDay = 10;
const appointmentsOnDate = await getAppointmentCount(date);

if (appointmentsOnDate >= maxAppointmentsPerDay) {
  return { error: "Daily limit reached", limitReached: true };
}
```

---

## Time Slot Generation

Generate time slots based on:
- Business hours (e.g., 9 AM - 6 PM)
- Service duration per vehicle type
- Existing bookings

**Example:**
```javascript
function generateTimeSlots(date, vehicleType) {
  const businessHours = { start: 9, end: 18 }; // 9 AM to 6 PM
  const serviceTime = getServiceTime(vehicleType); // in minutes
  const bookedSlots = getBookedSlots(date);
  
  const slots = [];
  for (let hour = businessHours.start; hour < businessHours.end; hour++) {
    const time = formatTime(hour, 0); // e.g., "09:00 AM"
    const available = !bookedSlots.includes(time);
    slots.push({ time, available });
  }
  
  return slots;
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**
- `DAILY_LIMIT_REACHED`: Daily appointment limit exceeded
- `SLOT_UNAVAILABLE`: Selected time slot is no longer available
- `INVALID_DATE`: Date is in the past or invalid format
- `EMPLOYEE_UNAVAILABLE`: Selected employee is not available
- `UNAUTHORIZED`: User doesn't have permission
- `NOT_FOUND`: Resource not found

---

## Implementation Notes

1. **Database Schema Suggestions:**
   - `appointments` table
   - `vehicle_types` table
   - `employees` table
   - `daily_limits` configuration table

2. **Real-time Updates:**
   - Consider using WebSockets for live appointment updates
   - Update availability in real-time when bookings are made

3. **Notifications:**
   - Send email/SMS confirmations when appointments are booked
   - Notify employees when assigned to appointments
   - Send reminders before appointment time

4. **Security:**
   - Validate user roles before allowing actions
   - Implement rate limiting to prevent spam bookings
   - Sanitize all input data

5. **Testing:**
   - Test daily limit enforcement
   - Test concurrent booking scenarios
   - Test status transition validations
