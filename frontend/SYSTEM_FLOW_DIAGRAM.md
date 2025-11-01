# 🔄 Appointment System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    APPOINTMENT SYSTEM ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│   CLIENT     │        │    ADMIN     │        │  EMPLOYEE    │
│   (User)     │        │              │        │              │
└──────┬───────┘        └──────┬───────┘        └──────┬───────┘
       │                       │                       │
       │ 1. Book               │ 2. Assign             │ 3. Execute
       │ Appointment           │ Employee              │ Service
       │                       │                       │
       ▼                       ▼                       ▼
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│  /appointments│       │/admin/       │        │/employee/    │
│              │        │appointments  │        │tasks         │
└──────┬───────┘        └──────┬───────┘        └──────┬───────┘
       │                       │                       │
       │                       │                       │
       └───────────────┬───────┴───────────┬───────────┘
                       │                   │
                       ▼                   ▼
                ┌─────────────────────────────┐
                │      API CLIENT (api.ts)    │
                │  ┌──────────────────────┐   │
                │  │ Authentication Token │   │
                │  │ (Clerk JWT)          │   │
                │  └──────────────────────┘   │
                └──────────────┬──────────────┘
                               │
                               ▼
                    ┌─────────────────┐
                    │  BACKEND API    │
                    │  (Your Server)  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    DATABASE     │
                    │   (PostgreSQL/  │
                    │    MongoDB)     │
                    └─────────────────┘


═══════════════════════════════════════════════════════════════════════
                         DETAILED USER FLOWS
═══════════════════════════════════════════════════════════════════════

┌───────────────────────────────────────────────────────────────────┐
│ 1️⃣  CLIENT FLOW: Book Appointment                                 │
└───────────────────────────────────────────────────────────────────┘

   Client                     Frontend                Backend
     │                           │                       │
     │  Select Date              │                       │
     ├──────────────────────────►│                       │
     │                           │ GET /daily-limit      │
     │                           ├──────────────────────►│
     │                           │◄──────────────────────┤
     │  ◄────────────────────────┤  {canBookMore: true}  │
     │   Show limit status       │                       │
     │                           │                       │
     │  Select Vehicle Type      │                       │
     ├──────────────────────────►│                       │
     │                           │ GET /available-slots  │
     │                           ├──────────────────────►│
     │                           │◄──────────────────────┤
     │  ◄────────────────────────┤  [time slots array]   │
     │   Show available slots    │                       │
     │                           │                       │
     │  Choose Time & Service    │                       │
     ├──────────────────────────►│                       │
     │                           │                       │
     │  Click "Book"             │                       │
     ├──────────────────────────►│ POST /appointments    │
     │                           ├──────────────────────►│
     │                           │◄──────────────────────┤
     │  ◄────────────────────────┤  Appointment created  │
     │   Success message!        │  Status: "pending"    │
     │                           │                       │


┌───────────────────────────────────────────────────────────────────┐
│ 2️⃣  ADMIN FLOW: Assign Employee                                   │
└───────────────────────────────────────────────────────────────────┘

   Admin                      Frontend                Backend
     │                           │                       │
     │  Select Date Filter       │                       │
     ├──────────────────────────►│                       │
     │                           │ GET /appointments     │
     │                           │    ?date=2025-11-05   │
     │                           ├──────────────────────►│
     │                           │◄──────────────────────┤
     │  ◄────────────────────────┤  [appointments array] │
     │   View all appointments   │                       │
     │                           │                       │
     │  Select Employee          │                       │
     │  for Appointment          │                       │
     ├──────────────────────────►│                       │
     │                           │                       │
     │  Click "Assign"           │                       │
     ├──────────────────────────►│ PATCH /appointments/  │
     │                           │       :id/assign      │
     │                           ├──────────────────────►│
     │                           │◄──────────────────────┤
     │  ◄────────────────────────┤  Updated appointment  │
     │   UI updates instantly    │  Status: "assigned"   │
     │   (Optimistic update)     │                       │


┌───────────────────────────────────────────────────────────────────┐
│ 3️⃣  EMPLOYEE FLOW: Handle Task                                    │
└───────────────────────────────────────────────────────────────────┘

   Employee                   Frontend                Backend
     │                           │                       │
     │  Open Tasks Page          │                       │
     ├──────────────────────────►│                       │
     │                           │ GET /appointments/    │
     │                           │     employee/:id      │
     │                           ├──────────────────────►│
     │                           │◄──────────────────────┤
     │  ◄────────────────────────┤  [assigned tasks]     │
     │   View assigned tasks     │                       │
     │                           │                       │
     │  Click "Start Work"       │                       │
     ├──────────────────────────►│ PATCH /appointments/  │
     │                           │       :id/status      │
     │                           │  {status:"in-progress"}
     │                           ├──────────────────────►│
     │                           │◄──────────────────────┤
     │  ◄────────────────────────┤  Updated status       │
     │   Status: "In Progress"   │                       │
     │                           │                       │
     │  [Work on the car...]     │                       │
     │                           │                       │
     │  Click "Mark Complete"    │                       │
     ├──────────────────────────►│ PATCH /appointments/  │
     │                           │       :id/status      │
     │                           │  {status:"completed"} │
     │                           ├──────────────────────►│
     │                           │◄──────────────────────┤
     │  ◄────────────────────────┤  Updated status       │
     │   Status: "Completed" ✓   │                       │


═══════════════════════════════════════════════════════════════════════
                         DATA FLOW DIAGRAM
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                      APPOINTMENT LIFECYCLE                       │
└─────────────────────────────────────────────────────────────────┘

    CREATE              ASSIGN              START              COMPLETE
      │                   │                   │                   │
      ▼                   ▼                   ▼                   ▼
┌──────────┐        ┌──────────┐       ┌──────────┐       ┌──────────┐
│ PENDING  │───────►│ ASSIGNED │──────►│   IN-    │──────►│COMPLETED │
│          │        │          │       │ PROGRESS │       │          │
└──────────┘        └──────────┘       └──────────┘       └──────────┘
     │                                                           ▲
     │                                                           │
     └─────────────────►┌──────────┐                           │
         (optional)      │CANCELLED │                           │
                         └──────────┘                           │
                                                                 │
                                         [Service Complete]─────┘


═══════════════════════════════════════════════════════════════════════
                      VALIDATION & LIMITS
═══════════════════════════════════════════════════════════════════════

┌────────────────────────────────────────────────────────────────┐
│  BOOKING VALIDATION FLOW                                        │
└────────────────────────────────────────────────────────────────┘

    User Attempts Booking
            │
            ▼
    ┌─────────────────┐
    │ Check Date      │────────► Must be today or future
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Check Daily     │────────► Total < Max (e.g., 50)
    │ Global Limit    │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Check Vehicle   │────────► Vehicle type < Max (e.g., 20)
    │ Type Limit      │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ Check Time Slot │────────► Slot available?
    │ Availability    │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │ CREATE          │────────► Status: "pending"
    │ APPOINTMENT     │
    └─────────────────┘


Example Limits:
┌──────────────────────────────────────────────────────┐
│ Daily Limit: 50 appointments/day                     │
│                                                       │
│ Vehicle Limits:                                       │
│   • Cars:        20/day                              │
│   • SUVs:        15/day                              │
│   • Trucks:      10/day                              │
│   • Motorcycles:  8/day                              │
│   • Vans:         7/day                              │
│                                                       │
│ Time Slots: 09:00-17:00 (8 slots × 1 hour)          │
│ Simultaneous: 3 appointments per time slot           │
└──────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════
                     FILE STRUCTURE DIAGRAM
═══════════════════════════════════════════════════════════════════════

frontend/
│
├── src/
│   ├── types/
│   │   └── appointment.ts        📝 Type Definitions
│   │       ├── VehicleType
│   │       ├── AppointmentStatus
│   │       ├── ServiceType
│   │       ├── Appointment
│   │       ├── TimeSlot
│   │       └── DailyLimit
│   │
│   ├── lib/
│   │   └── api.ts                🔌 API Client
│   │       ├── checkDailyLimit()
│   │       ├── getAvailableSlots()
│   │       ├── createAppointment()
│   │       ├── getAllAppointments()
│   │       ├── assignEmployee()
│   │       ├── getEmployeeTasks()
│   │       └── updateStatus()
│   │
│   ├── pages/
│   │   ├── ClientAppointments.tsx  👤 User Booking
│   │   │   ├── Date Picker
│   │   │   ├── Vehicle Selector
│   │   │   ├── Time Slot Grid
│   │   │   ├── Service Dropdown
│   │   │   └── Book Button
│   │   │
│   │   ├── AdminAppointments.tsx   👨‍💼 Admin Management
│   │   │   ├── Date Filter
│   │   │   ├── Statistics Dashboard
│   │   │   ├── Appointments List
│   │   │   └── Employee Assignment
│   │   │
│   │   └── EmployeeTasks.tsx       👷 Employee Tasks
│   │       ├── Status Filters
│   │       ├── Task Cards
│   │       ├── Start Work Button
│   │       └── Complete Button
│   │
│   └── App.tsx                    🚦 Routes
│       ├── /appointments          → ClientAppointments
│       ├── /admin/appointments    → AdminAppointments
│       └── /employee/tasks        → EmployeeTasks
│
└── Documentation/
    ├── QUICK_START.md            📚 Quick Reference
    └── APPOINTMENT_SYSTEM_GUIDE.md  📖 Detailed Guide


═══════════════════════════════════════════════════════════════════════
                         TECHNOLOGY STACK
═══════════════════════════════════════════════════════════════════════

┌────────────────────────────────────────────────────────────────┐
│  Frontend Stack                                                 │
├────────────────────────────────────────────────────────────────┤
│  React 18+              Component Framework                     │
│  TypeScript             Type Safety                             │
│  React Router           Navigation                              │
│  Clerk                  Authentication                          │
│  Tailwind CSS           Styling                                 │
│  shadcn/ui              UI Components                           │
│  Vite                   Build Tool                              │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│  Backend Requirements (Your Implementation)                     │
├────────────────────────────────────────────────────────────────┤
│  Node.js / Java / .NET  Server Runtime                         │
│  Express / Spring Boot  API Framework                          │
│  PostgreSQL / MongoDB   Database                               │
│  JWT                    Auth Tokens                            │
│  REST API               Communication                           │
└────────────────────────────────────────────────────────────────┘
```
