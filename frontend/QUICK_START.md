# 📋 Quick Start - Appointment System

## ✅ What Has Been Created

I've implemented a complete **3-role appointment system** for your Automobile Service Management application:

### 🎯 Three User Flows

1. **👤 Client (User)** - Book Appointments
   - Select date, vehicle type, and time slot
   - Real-time availability checking
   - Daily limit validation (system-wide & per vehicle)
   - Service selection with notes

2. **👨‍💼 Admin** - Manage & Assign
   - View all appointments by date
   - Statistics dashboard
   - Assign employees to appointments
   - Track appointment status

3. **👷 Employee** - Handle Tasks
   - View assigned appointments
   - Filter by status (assigned, in-progress, completed)
   - Start work and mark complete
   - See customer details

---

## 📂 Files Created

### ✅ Frontend Files (All Complete!)

```
frontend/
├── src/
│   ├── types/
│   │   └── appointment.ts          ✅ Type definitions
│   ├── lib/
│   │   └── api.ts                  ✅ API client
│   ├── pages/
│   │   ├── ClientAppointments.tsx  ✅ Client booking page
│   │   ├── AdminAppointments.tsx   ✅ Admin management page
│   │   └── EmployeeTasks.tsx       ✅ Employee tasks page
│   └── App.tsx                     ✅ Updated with routes
└── APPOINTMENT_SYSTEM_GUIDE.md     ✅ Complete documentation
```

### Routes Added

```
/appointments           → Client booking (User role)
/admin/appointments     → Admin management (Admin role)
/employee/tasks         → Employee tasks (Employee role)
```

---

## 🚀 How to Use

### 1️⃣ Set Environment Variable

Create `.env` in your frontend folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2️⃣ Backend API Requirements

You need to implement these endpoints:

#### For Clients:
- `GET /api/appointments/daily-limit?date=YYYY-MM-DD`
- `GET /api/appointments/available-slots?date=YYYY-MM-DD&vehicleType=car`
- `POST /api/appointments` - Create appointment

#### For Admin:
- `GET /api/appointments?date=YYYY-MM-DD` - Get all appointments
- `PATCH /api/appointments/:id/assign` - Assign employee

#### For Employees:
- `GET /api/appointments/employee/:employeeId` - Get employee's tasks
- `PATCH /api/appointments/:id/status` - Update status

See `APPOINTMENT_SYSTEM_GUIDE.md` for detailed API specs!

### 3️⃣ Update Navigation (Optional)

Add links to your `Navbar.tsx`:

```tsx
{role === 'user' && <Link to="/appointments">Book Appointment</Link>}
{role === 'admin' && <Link to="/admin/appointments">Appointments</Link>}
{role === 'employee' && <Link to="/employee/tasks">My Tasks</Link>}
```

---

## 🎨 Features Implemented

### Client Page Features
✅ Date picker (prevents past dates)  
✅ Vehicle type selector (Car, SUV, Truck, Motorcycle, Van)  
✅ Time slot grid with availability  
✅ Daily limit warnings  
✅ Vehicle-specific limit warnings  
✅ Service type dropdown  
✅ Description field  
✅ Real-time validation  
✅ Success/error notifications  

### Admin Page Features
✅ Date filter  
✅ Statistics dashboard (total, pending, in-progress, completed)  
✅ Appointments grouped by time slots  
✅ Employee assignment dropdown  
✅ Status badges  
✅ Optimistic UI updates  
✅ Refresh functionality  

### Employee Page Features
✅ Task statistics  
✅ Status filters (all, assigned, in-progress, completed)  
✅ Card-based layout  
✅ Start work button  
✅ Mark complete button  
✅ Customer contact info  
✅ Service details display  

---

## 🎯 System Logic Explained

### Daily Limits

The system prevents overbooking with two types of limits:

1. **Global Limit**: Total appointments per day (e.g., 50)
2. **Vehicle Limits**: Per vehicle type (e.g., 20 cars, 10 trucks)

Example response from backend:
```json
{
  "date": "2025-11-05",
  "totalAppointments": 35,
  "maxAppointments": 50,
  "canBookMore": true,
  "vehicleLimits": {
    "car": { "current": 15, "max": 20, "available": true },
    "truck": { "current": 8, "max": 10, "available": true }
  }
}
```

### Appointment Flow

```
1. Client books → Status: "pending"
2. Admin assigns employee → Status: "assigned"
3. Employee starts work → Status: "in-progress"
4. Employee completes → Status: "completed"
```

### Time Slots

Backend should provide slots like:
```
09:00-10:00, 10:00-11:00, ..., 16:00-17:00
```

Each slot has:
- `available`: boolean (if bookable)
- `remainingSlots`: number (e.g., 3 left)

---

## 🧪 Testing Steps

### Test Client Flow:
1. Navigate to `/appointments`
2. Select a date (today or future)
3. Choose a vehicle type
4. Pick an available time slot
5. Select service type
6. Add description (optional)
7. Click "Book Appointment"
8. ✅ Should show success message

### Test Admin Flow:
1. Navigate to `/admin/appointments`
2. Select a date to filter
3. See all appointments for that date
4. Click employee dropdown on a pending appointment
5. Select an employee
6. Click "Assign Employee"
7. ✅ Should update status to "assigned"

### Test Employee Flow:
1. Navigate to `/employee/tasks`
2. See all assigned tasks
3. Click "Start Work" on an assigned task
4. ✅ Status changes to "in-progress"
5. Click "Mark Complete"
6. ✅ Status changes to "completed"

---

## 🔐 Authentication Notes

The system uses **Clerk** for authentication. The API client in `src/lib/api.ts` needs your Clerk token. Update if needed:

```typescript
// Current (simple version):
const token = localStorage.getItem('clerk_token');

// Better version (use Clerk's hook):
import { useAuth } from '@clerk/clerk-react';
const { getToken } = useAuth();
const token = await getToken();
```

---

## 📝 Backend Database Schema Example

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

CREATE INDEX idx_date ON appointments(date);
CREATE INDEX idx_employee ON appointments(assigned_employee_id);
```

---

## 🎨 UI Technology Stack

- **React** with TypeScript
- **Clerk** for authentication
- **React Router** for navigation
- **Tailwind CSS** for styling
- **shadcn/ui** for Button component

---

## 🚨 Important Notes

### ⚠️ Before Running:

1. **Backend must be running** with all API endpoints
2. **Clerk authentication** must be configured
3. **Environment variable** `VITE_API_BASE_URL` must be set
4. **Database** must have appointments table

### 🔧 Common Issues:

**"Failed to fetch"**
→ Check if backend is running at `VITE_API_BASE_URL`

**"Unauthorized"**
→ Verify Clerk token is being sent correctly

**"No slots available"**
→ Backend needs to return available slots for that date/vehicle

---

## 📚 Documentation

See `APPOINTMENT_SYSTEM_GUIDE.md` for:
- Detailed API specifications
- Backend implementation guide
- Database schema
- Advanced features
- Deployment checklist

---

## 🎉 You're All Set!

Your appointment system is ready to use! Just:

1. ✅ Implement the backend APIs
2. ✅ Set your environment variable
3. ✅ Test each user flow

**Need help?** Check the detailed guide or review the code comments in each file.

---

## 📞 Quick Reference

| Role | Route | File |
|------|-------|------|
| Client | `/appointments` | `ClientAppointments.tsx` |
| Admin | `/admin/appointments` | `AdminAppointments.tsx` |
| Employee | `/employee/tasks` | `EmployeeTasks.tsx` |

| Component | Purpose |
|-----------|---------|
| `appointment.ts` | Type definitions |
| `api.ts` | API client functions |

---

**Happy coding! 🚀**
