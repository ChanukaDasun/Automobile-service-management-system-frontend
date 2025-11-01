# Component Structure & Visual Guide

## 📐 Page Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    APPOINTMENT PAGE                      │
├─────────────────────────────────────────────────────────┤
│  Header: "Book Your Appointment"                        │
│  Subtitle: "Select a date and time slot..."             │
├─────────────────────────────────────────────────────────┤
│  [Success/Error Messages] (conditional)                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────┐  ┌────────────────────────┐   │
│  │  SELECTION CARD    │  │  TIME SLOTS CARD       │   │
│  ├────────────────────┤  ├────────────────────────┤   │
│  │ 📅 Select Date &   │  │ 🕐 Available Slots     │   │
│  │    Vehicle         │  │                         │   │
│  ├────────────────────┤  ├────────────────────────┤   │
│  │                    │  │ Status:                 │   │
│  │ Vehicle Type:      │  │ "7 of 10 slots avail"  │   │
│  │ [Dropdown ▼]       │  ├────────────────────────┤   │
│  │                    │  │                         │   │
│  │ Date:              │  │ [9AM] [10AM] [11AM]    │   │
│  │ [Date Picker]      │  │ [2PM] [3PM]  [4PM]     │   │
│  │                    │  │ [5PM] [6PM]            │   │
│  │ ℹ️ Important Info   │  │                         │   │
│  │ • Daily limits     │  │ [Book Appointment]     │   │
│  │ • Arrive early     │  │                         │   │
│  │                    │  │                         │   │
│  └────────────────────┘  └────────────────────────┘   │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  SERVICE INFORMATION CARD                               │
│  [Quality] [Timely] [Real-time Updates]                │
└─────────────────────────────────────────────────────────┘
```

## 🎨 UI Component Hierarchy

```
App.tsx
 └─ Router
     └─ Route: /appointment
         └─ RoleGuard (User)
             └─ Appointment.tsx
                 ├─ Header Section
                 │   ├─ h1: "Book Your Appointment"
                 │   └─ p: Description
                 │
                 ├─ Alert Messages (conditional)
                 │   ├─ Success Alert (green)
                 │   └─ Error Alert (red)
                 │
                 ├─ Grid Layout (2 columns)
                 │   │
                 │   ├─ Card 1: Selection
                 │   │   ├─ CardHeader
                 │   │   │   ├─ Calendar Icon
                 │   │   │   └─ CardTitle
                 │   │   │
                 │   │   └─ CardContent
                 │   │       ├─ Label + Select (Vehicle)
                 │   │       │   └─ SelectTrigger
                 │   │       │       └─ SelectContent
                 │   │       │           └─ SelectItem (×4)
                 │   │       │
                 │   │       ├─ Label + Input (Date)
                 │   │       │
                 │   │       └─ Info Box (blue background)
                 │   │
                 │   └─ Card 2: Time Slots
                 │       ├─ CardHeader
                 │       │   ├─ Clock Icon
                 │       │   ├─ CardTitle
                 │       │   └─ CardDescription (slots count)
                 │       │
                 │       └─ CardContent
                 │           ├─ Loading Spinner (conditional)
                 │           │
                 │           ├─ Availability Status Box
                 │           │   ├─ Slots remaining info
                 │           │   └─ Date formatted
                 │           │
                 │           ├─ Time Slots Grid
                 │           │   └─ Button (×8 slots)
                 │           │       ├─ Clock Icon
                 │           │       ├─ Time Text
                 │           │       └─ Status Text
                 │           │
                 │           └─ Book Button (conditional)
                 │
                 └─ Service Info Card
                     ├─ CardHeader
                     └─ CardContent (3 columns)
                         ├─ Quality Service
                         ├─ Timely Service
                         └─ Real-time Updates
```

## 🎭 State Management

```typescript
// Component State
const [selectedDate, setSelectedDate] = useState<string>('')
const [vehicleType, setVehicleType] = useState<string>('')
const [availability, setAvailability] = useState<DailyAvailability | null>(null)
const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('')
const [loading, setLoading] = useState(false)
const [bookingSuccess, setBookingSuccess] = useState(false)
const [error, setError] = useState<string>('')

// External State
const { user } = useUser() // from Clerk
```

## 🔄 User Interaction Flow

```
START
  │
  ├─ Page Load
  │   └─> fetchVehicleTypes()
  │       └─> setState: vehicleTypes
  │
  ├─ User: Select Vehicle Type
  │   └─> setVehicleType(id)
  │       └─> useEffect triggers
  │           └─> if (date && vehicle)
  │               └─> fetchAvailability()
  │
  ├─ User: Select Date
  │   └─> setSelectedDate(date)
  │       └─> useEffect triggers
  │           └─> if (date && vehicle)
  │               └─> fetchAvailability()
  │                   ├─> setLoading(true)
  │                   ├─> API call (mock)
  │                   ├─> setAvailability(data)
  │                   └─> setLoading(false)
  │
  ├─ Display: Time Slots
  │   └─> availability.timeSlots.map()
  │       └─> Button for each slot
  │           ├─ Green: Available
  │           ├─ Gray: Booked
  │           └─ Blue: Selected
  │
  ├─ User: Click Time Slot
  │   └─> setSelectedTimeSlot(time)
  │       └─> Button highlights
  │
  ├─ User: Click "Book Appointment"
  │   └─> handleBookAppointment()
  │       ├─> Validation checks
  │       ├─> setLoading(true)
  │       ├─> API call (mock)
  │       ├─> setBookingSuccess(true)
  │       ├─> Refresh availability
  │       ├─> Auto-hide after 3s
  │       └─> setLoading(false)
  │
END (Success! Show green message)
```

## 🎨 Color Scheme

```css
/* Primary Colors */
Blue-600:  #2563eb  /* Buttons, icons */
Cyan-500:  #06b6d4  /* Gradients */

/* Background */
Slate-50:  #f8fafc  /* Page background */
Slate-100: #f1f5f9  /* Gradient end */

/* Status Colors */
Green-50:  #f0fdf4  /* Success background */
Green-600: #16a34a  /* Success text */
Red-50:    #fef2f2  /* Error background */
Red-600:   #dc2626  /* Error text */
Blue-50:   #eff6ff  /* Info background */

/* Text */
Slate-900: #0f172a  /* Headings */
Slate-600: #475569  /* Body text */
Slate-500: #64748b  /* Muted text */
```

## 📱 Responsive Breakpoints

```css
/* Mobile First */
Default: Single column, stacked layout

/* Tablet (md: 768px+) */
- 2-column grid for cards
- Time slots: 2 columns

/* Desktop (lg: 1024px+) */
- 2-column grid maintained
- Max width: 1280px
- Centered layout
```

## 🔧 Key Functions

### 1. fetchVehicleTypes()
```
Purpose: Load available vehicle types
When: Component mount
Returns: Array of VehicleType
Updates: vehicleTypes state
```

### 2. fetchAvailability(date, vehicleTypeId)
```
Purpose: Get available time slots
When: Date or vehicle changes
Params: date (string), vehicleTypeId (string)
Returns: DailyAvailability object
Updates: availability state
Loading: Shows spinner during fetch
```

### 3. handleBookAppointment()
```
Purpose: Book the selected appointment
When: User clicks "Book Appointment"
Validates: 
  - All fields selected
  - User is logged in
Creates: New appointment
Success: Shows green message
Error: Shows red message
```

### 4. getMinDate()
```
Purpose: Get minimum selectable date
Returns: Today's date in YYYY-MM-DD format
Usage: Prevents past date selection
```

## 🎯 Props & Types

### VehicleType
```typescript
{
  id: string              // Unique identifier
  name: string            // Display name
  description?: string    // Optional description
  serviceTime: number     // Duration in minutes
}
```

### TimeSlot
```typescript
{
  time: string           // e.g., "09:00 AM"
  available: boolean     // Can be booked?
  appointmentId?: string // If booked, reference
}
```

### DailyAvailability
```typescript
{
  date: string           // YYYY-MM-DD
  totalSlots: number     // Max per day
  bookedSlots: number    // Currently booked
  remainingSlots: number // Available
  limitReached: boolean  // Is full?
  timeSlots: TimeSlot[]  // Individual slots
}
```

## 🚦 Conditional Rendering

### Success Message
```tsx
{bookingSuccess && (
  <div className="green-alert">
    ✓ Appointment booked successfully!
  </div>
)}
```

### Error Message
```tsx
{error && (
  <div className="red-alert">
    ⚠️ {error}
  </div>
)}
```

### Loading State
```tsx
{loading ? (
  <Spinner />
) : availability ? (
  <TimeSlots />
) : (
  <EmptyState />
)}
```

### Daily Limit Reached
```tsx
{availability.limitReached ? (
  <RedAlert>No slots available</RedAlert>
) : (
  <TimeSlotGrid />
)}
```

### Book Button
```tsx
{selectedTimeSlot && !limitReached && (
  <Button>Book Appointment</Button>
)}
```

## 🎬 Animation States

1. **Page Load**: Fade in
2. **Card Hover**: Slight lift (shadow increase)
3. **Button Hover**: Color transition
4. **Loading**: Rotating spinner
5. **Success**: Fade in from top
6. **Error**: Shake animation
7. **Slot Selection**: Background color transition

## 📊 Data Flow Diagram

```
┌──────────────┐
│   User       │
└──────┬───────┘
       │
       │ Selects Vehicle & Date
       ▼
┌──────────────────┐
│  Appointment.tsx │◄────┐
│                  │     │
│  - State         │     │
│  - Logic         │     │
│  - UI            │     │
└────────┬─────────┘     │
         │               │
         │ Calls         │ Returns
         ▼               │
┌──────────────────┐     │
│  fetchAvailability│     │
│                  │     │
│  Mock API        │─────┘
│  (Future: Real)  │
└──────────────────┘
         │
         │ Updates
         ▼
┌──────────────────┐
│  UI Components   │
│                  │
│  - Time Slots    │
│  - Status Info   │
│  - Book Button   │
└──────────────────┘
```

## 🏗️ File Dependencies

```
Appointment.tsx
├─ React (useState, useEffect)
├─ @clerk/clerk-react (useUser)
├─ lucide-react (Icons)
├─ @/components/ui/
│  ├─ button
│  ├─ card
│  ├─ select
│  ├─ input
│  └─ label
└─ @/types/appointment
   ├─ DailyAvailability
   ├─ VehicleType
   └─ TimeSlot
```

## 📈 Performance Considerations

1. **useEffect Dependencies**: Only refetch when date/vehicle changes
2. **Loading States**: Show spinner during API calls
3. **Debouncing**: Not needed (controlled selections)
4. **Memoization**: Could add for time slot rendering (future optimization)
5. **Lazy Loading**: Images are lazy loaded

## 🔐 Security Considerations

1. **Authentication**: Clerk handles user auth
2. **Role Check**: RoleGuard prevents unauthorized access
3. **Input Validation**: All inputs validated before submit
4. **XSS Protection**: React escapes all user input
5. **CSRF**: Will be handled by backend API

---

**This visual guide complements the code implementation!**
