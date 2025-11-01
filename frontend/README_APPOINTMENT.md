# Client Appointment Booking Implementation

## Overview
This implementation provides a complete **CLIENT-SIDE** appointment booking system where users can:
- View available appointment slots for different vehicle types
- Check daily appointment limits
- Book appointments based on date availability
- See real-time slot availability

---

## What Was Implemented

### 1. **Type Definitions** (`src/types/appointment.ts`)
- `Appointment`: Complete appointment data structure
- `TimeSlot`: Individual time slot with availability status
- `DailyAvailability`: Daily slot information with limit tracking
- `VehicleType`: Different vehicle service types

### 2. **UI Components** (`src/components/ui/`)
Created necessary shadcn/ui components:
- ✅ `card.tsx` - Card layout components
- ✅ `select.tsx` - Dropdown selection component
- ✅ `input.tsx` - Input field component
- ✅ `label.tsx` - Label component
- ✅ `button.tsx` - Already existed

### 3. **Appointment Page** (`src/pages/Appointment.tsx`)
A fully functional appointment booking page with:

#### Features:
- **Vehicle Type Selection**: Dropdown to choose vehicle type (Sedan, SUV, Truck, Motorcycle)
- **Date Picker**: Calendar input to select appointment date
- **Daily Limit Check**: Shows remaining slots and limit status
- **Time Slot Display**: Grid of available time slots
- **Real-time Availability**: Updates when date/vehicle changes
- **Booking Functionality**: Books appointments with validation
- **Success/Error Messages**: User feedback for actions
- **Loading States**: Spinner during data fetch
- **Responsive Design**: Works on mobile and desktop

#### User Flow:
1. Select vehicle type from dropdown
2. Choose date from date picker
3. System checks daily limit and shows availability
4. User selects available time slot
5. Click "Book Appointment" button
6. Success confirmation message displayed

### 4. **User Dashboard** (`src/pages/UserPage.tsx`)
Updated with:
- Navigation button to appointment page
- Clean dashboard layout
- Quick access to booking

### 5. **Routing** (`src/App.tsx`)
Added `/appointment` route protected by User role guard

---

## Key Features Implemented

### ✅ Daily Limit Check
```typescript
- Tracks totalSlots vs bookedSlots
- Shows "Daily limit reached" message when full
- Disables booking when no slots available
- Visual indicators (red/green status)
```

### ✅ Vehicle Type Based Booking
```typescript
- Different vehicle types with service times
- Mock data includes: Sedan, SUV, Truck, Motorcycle
- Ready for API integration
```

### ✅ Available Slot Display
```typescript
- Time slots shown in grid layout
- Visual distinction between available/booked
- Disabled state for booked slots
- Selected state highlighting
```

### ✅ Validation
```typescript
- Prevents booking without required fields
- Checks user authentication
- Validates date selection (no past dates)
- Shows appropriate error messages
```

---

## Mock Data Structure

The implementation uses mock data that mirrors the expected API responses:

### Vehicle Types Mock:
```typescript
[
  { id: '1', name: 'Sedan', description: 'Regular car service', serviceTime: 60 },
  { id: '2', name: 'SUV', description: 'SUV service', serviceTime: 90 },
  { id: '3', name: 'Truck', description: 'Truck service', serviceTime: 120 },
  { id: '4', name: 'Motorcycle', description: 'Motorcycle service', serviceTime: 45 }
]
```

### Availability Mock:
```typescript
{
  date: "2025-11-15",
  totalSlots: 10,
  bookedSlots: 3,
  remainingSlots: 7,
  limitReached: false,
  timeSlots: [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: false, appointmentId: 'xxx' },
    // ... more slots
  ]
}
```

---

## API Integration Points

All API calls are marked with `TODO` comments and ready for integration:

### 1. Fetch Vehicle Types
```typescript
// Line ~48 in Appointment.tsx
// TODO: Replace with actual API call
// const response = await fetch('/api/vehicle-types');
```

### 2. Check Availability
```typescript
// Line ~92 in Appointment.tsx
// TODO: Replace with actual API call
// const response = await fetch(`/api/appointments/availability?date=${date}&vehicleType=${vehicleTypeId}`);
```

### 3. Book Appointment
```typescript
// Line ~130 in Appointment.tsx
// TODO: Replace with actual API call
// const response = await fetch('/api/appointments', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(appointmentData),
// });
```

---

## How to Test

### 1. Start Development Server
```bash
cd frontend
npm run dev
```

### 2. Login as User
- Navigate to http://localhost:5173
- Login with a user account (role: 'user')

### 3. Access Appointment Page
- From User Dashboard, click "Book Now"
- Or navigate directly to `/appointment`

### 4. Test Booking Flow
1. Select a vehicle type (e.g., Sedan)
2. Select a future date
3. Wait for availability to load (mock 1-2 second delay)
4. See available time slots
5. Click on an available slot
6. Click "Book Appointment"
7. See success message

### 5. Test Daily Limit
- Mock data randomly generates booked slots
- When all slots booked, you'll see "Daily limit reached"

---

## Next Steps for Backend Integration

### 1. API Endpoints to Create
See `API_DOCUMENTATION.md` for complete API specifications:
- `GET /api/vehicle-types`
- `GET /api/appointments/availability`
- `POST /api/appointments`

### 2. Database Schema Needed
```sql
-- appointments table
CREATE TABLE appointments (
  id VARCHAR PRIMARY KEY,
  client_id VARCHAR NOT NULL,
  client_name VARCHAR NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot VARCHAR NOT NULL,
  vehicle_type VARCHAR NOT NULL,
  status ENUM('pending', 'assigned', 'in-progress', 'completed', 'cancelled'),
  assigned_employee_id VARCHAR,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- vehicle_types table
CREATE TABLE vehicle_types (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  service_time INT NOT NULL -- in minutes
);

-- daily_limits configuration
CREATE TABLE daily_limits (
  date DATE PRIMARY KEY,
  max_slots INT DEFAULT 10
);
```

### 3. Business Logic to Implement
- Daily limit enforcement
- Slot availability calculation
- Concurrent booking handling
- Status management

### 4. Replace Mock Functions
Simply replace the mock API calls with real `fetch()` calls to your backend endpoints.

---

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx       ✅
│   │       ├── card.tsx         ✅ NEW
│   │       ├── select.tsx       ✅ NEW
│   │       ├── input.tsx        ✅ NEW
│   │       └── label.tsx        ✅ NEW
│   ├── pages/
│   │   ├── Appointment.tsx      ✅ IMPLEMENTED
│   │   ├── UserPage.tsx         ✅ UPDATED
│   │   └── ...
│   ├── types/
│   │   ├── appointment.ts       ✅ NEW
│   │   └── globals.ts
│   └── App.tsx                  ✅ UPDATED (routing)
├── API_DOCUMENTATION.md         ✅ NEW
└── README_APPOINTMENT.md        ✅ THIS FILE
```

---

## Dependencies Installed

```json
{
  "@radix-ui/react-select": "latest",
  "@radix-ui/react-label": "latest"
}
```

---

## Screenshots of Functionality

### Appointment Booking Flow:
1. **Initial State**: Select vehicle type and date
2. **Availability Loaded**: Shows available slots with daily limit info
3. **Slot Selected**: User clicks on time slot
4. **Booking Success**: Green confirmation message

### Daily Limit Reached:
- Red alert message: "Daily limit reached - No slots available"
- All slots shown as "Booked"
- Button disabled

### Responsive Design:
- Mobile: Single column layout
- Desktop: Two column layout
- Time slots grid adapts to screen size

---

## Your Responsibilities

As the **CLIENT** developer, you've completed:
- ✅ Appointment booking interface
- ✅ Daily limit checking UI
- ✅ Vehicle type selection
- ✅ Date-based availability
- ✅ Time slot selection
- ✅ Booking validation

### Ready for:
- Backend API integration
- Real data fetching
- Error handling from server
- WebSocket for real-time updates (optional)

---

## Admin & Employee Parts

### Admin (Not Your Responsibility):
- View all appointments by date
- Assign employees to appointments
- Manage daily limits

### Employee (Not Your Responsibility):
- View assigned tasks
- Update task status
- Mark work as complete

---

## Support & Documentation

- **API Spec**: See `API_DOCUMENTATION.md`
- **Component Docs**: See shadcn/ui documentation
- **Type Definitions**: See `src/types/appointment.ts`

---

## Questions?

Common questions and answers:

**Q: How do I change the daily limit?**
A: This is controlled by backend. Frontend displays what backend returns in `totalSlots` field.

**Q: Can I add more vehicle types?**
A: Yes, backend should return them from `/api/vehicle-types` endpoint.

**Q: How to add more time slots?**
A: Backend generates time slots based on business hours. Frontend displays what's returned.

**Q: What about real-time updates?**
A: Currently, availability refreshes on date/vehicle change. Can add WebSocket later.

---

## Testing Checklist

- [x] Vehicle type dropdown works
- [x] Date picker allows future dates only
- [x] Availability loads on selection
- [x] Time slots display correctly
- [x] Available slots are clickable
- [x] Booked slots are disabled
- [x] Daily limit message shows when full
- [x] Booking validates required fields
- [x] Success message displays after booking
- [x] Error messages show appropriately
- [x] Loading states work correctly
- [x] Responsive on mobile/desktop
- [x] Navigation from User Dashboard works

---

## Congratulations! 🎉

Your client appointment booking system is complete and ready for backend integration!
