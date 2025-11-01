# 🔧 Backend API Implementation Examples

This file provides example implementations for the required backend endpoints.

---

## 📋 Table of Contents
1. [Node.js/Express Examples](#nodejs-express)
2. [Java/Spring Boot Examples](#java-spring-boot)
3. [Database Schema](#database-schema)
4. [Validation Logic](#validation-logic)

---

## Node.js Express

### Setup
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Auth middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  // Verify Clerk JWT token here
  // Set req.user with decoded token data
  next();
};
```

### 1. Check Daily Limit
```javascript
// GET /api/appointments/daily-limit?date=YYYY-MM-DD
app.get('/api/appointments/daily-limit', verifyToken, async (req, res) => {
  try {
    const { date } = req.query;
    
    // Configuration
    const MAX_DAILY_APPOINTMENTS = 50;
    const VEHICLE_LIMITS = {
      car: 20,
      suv: 15,
      truck: 10,
      motorcycle: 8,
      van: 7
    };
    
    // Count total appointments for the date
    const totalAppointments = await db.appointments.count({
      where: { date }
    });
    
    // Count by vehicle type
    const vehicleCounts = await db.appointments.groupBy({
      by: ['vehicleType'],
      where: { date },
      _count: true
    });
    
    // Build vehicle limits response
    const vehicleLimits = {};
    for (const [vehicleType, maxCount] of Object.entries(VEHICLE_LIMITS)) {
      const current = vehicleCounts.find(v => v.vehicleType === vehicleType)?._count || 0;
      vehicleLimits[vehicleType] = {
        current,
        max: maxCount,
        available: current < maxCount
      };
    }
    
    res.json({
      date,
      totalAppointments,
      maxAppointments: MAX_DAILY_APPOINTMENTS,
      canBookMore: totalAppointments < MAX_DAILY_APPOINTMENTS,
      vehicleLimits
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### 2. Get Available Slots
```javascript
// GET /api/appointments/available-slots?date=YYYY-MM-DD&vehicleType=car
app.get('/api/appointments/available-slots', verifyToken, async (req, res) => {
  try {
    const { date, vehicleType } = req.query;
    
    // Define time slots
    const TIME_SLOTS = [
      '09:00-10:00', '10:00-11:00', '11:00-12:00',
      '12:00-13:00', '13:00-14:00', '14:00-15:00',
      '15:00-16:00', '16:00-17:00'
    ];
    
    const MAX_PER_SLOT = 3; // 3 appointments per time slot
    
    // Get existing appointments for this date
    const appointments = await db.appointments.findMany({
      where: { date }
    });
    
    // Count appointments per slot
    const slotCounts = {};
    appointments.forEach(apt => {
      slotCounts[apt.timeSlot] = (slotCounts[apt.timeSlot] || 0) + 1;
    });
    
    // Build available slots response
    const availableSlots = TIME_SLOTS.map(slot => {
      const count = slotCounts[slot] || 0;
      return {
        time: slot,
        available: count < MAX_PER_SLOT,
        remainingSlots: MAX_PER_SLOT - count
      };
    });
    
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### 3. Create Appointment
```javascript
// POST /api/appointments
app.post('/api/appointments', verifyToken, async (req, res) => {
  try {
    const { vehicleType, date, timeSlot, serviceType, description } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!vehicleType || !date || !timeSlot || !serviceType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check daily limit
    const dailyCount = await db.appointments.count({
      where: { date }
    });
    
    if (dailyCount >= 50) {
      return res.status(400).json({ message: 'Daily limit reached' });
    }
    
    // Check slot availability
    const slotCount = await db.appointments.count({
      where: { date, timeSlot }
    });
    
    if (slotCount >= 3) {
      return res.status(400).json({ message: 'Time slot full' });
    }
    
    // Create appointment
    const appointment = await db.appointments.create({
      data: {
        userId,
        userName: req.user.name,
        userEmail: req.user.email,
        vehicleType,
        date,
        timeSlot,
        serviceType,
        description,
        status: 'pending'
      }
    });
    
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### 4. Get All Appointments (Admin)
```javascript
// GET /api/appointments?date=YYYY-MM-DD
app.get('/api/appointments', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { date } = req.query;
    
    const where = date ? { date } : {};
    
    const appointments = await db.appointments.findMany({
      where,
      orderBy: [
        { date: 'asc' },
        { timeSlot: 'asc' }
      ]
    });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### 5. Assign Employee
```javascript
// PATCH /api/appointments/:id/assign
app.patch('/api/appointments/:id/assign', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { id } = req.params;
    const { employeeId, employeeName } = req.body;
    
    if (!employeeId || !employeeName) {
      return res.status(400).json({ message: 'Employee ID and name required' });
    }
    
    const appointment = await db.appointments.update({
      where: { id },
      data: {
        assignedEmployeeId: employeeId,
        assignedEmployeeName: employeeName,
        status: 'assigned',
        updatedAt: new Date()
      }
    });
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### 6. Get Employee Tasks
```javascript
// GET /api/appointments/employee/:employeeId
app.get('/api/appointments/employee/:employeeId', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // Check if user is the employee or admin
    if (req.user.id !== employeeId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const appointments = await db.appointments.findMany({
      where: {
        assignedEmployeeId: employeeId,
        status: {
          in: ['assigned', 'in-progress']
        }
      },
      orderBy: [
        { date: 'asc' },
        { timeSlot: 'asc' }
      ]
    });
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

### 7. Update Status
```javascript
// PATCH /api/appointments/:id/status
app.patch('/api/appointments/:id/status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const appointment = await db.appointments.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date()
      }
    });
    
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

---

## Java Spring Boot

### Controller Example
```java
@RestController
@RequestMapping("/api/appointments")
@CrossOrigin
public class AppointmentController {
    
    @Autowired
    private AppointmentService appointmentService;
    
    // 1. Check Daily Limit
    @GetMapping("/daily-limit")
    public ResponseEntity<DailyLimitResponse> getDailyLimit(
            @RequestParam String date) {
        DailyLimitResponse response = appointmentService.checkDailyLimit(date);
        return ResponseEntity.ok(response);
    }
    
    // 2. Get Available Slots
    @GetMapping("/available-slots")
    public ResponseEntity<List<TimeSlot>> getAvailableSlots(
            @RequestParam String date,
            @RequestParam String vehicleType) {
        List<TimeSlot> slots = appointmentService.getAvailableSlots(date, vehicleType);
        return ResponseEntity.ok(slots);
    }
    
    // 3. Create Appointment
    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @RequestBody CreateAppointmentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Appointment appointment = appointmentService.createAppointment(request, userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    }
    
    // 4. Get All Appointments (Admin)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Appointment>> getAllAppointments(
            @RequestParam(required = false) String date) {
        List<Appointment> appointments = appointmentService.getAllAppointments(date);
        return ResponseEntity.ok(appointments);
    }
    
    // 5. Assign Employee
    @PatchMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Appointment> assignEmployee(
            @PathVariable String id,
            @RequestBody AssignEmployeeRequest request) {
        Appointment appointment = appointmentService.assignEmployee(id, request);
        return ResponseEntity.ok(appointment);
    }
    
    // 6. Get Employee Tasks
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Appointment>> getEmployeeTasks(
            @PathVariable String employeeId,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Verify access
        if (!hasAccess(userDetails, employeeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<Appointment> tasks = appointmentService.getEmployeeTasks(employeeId);
        return ResponseEntity.ok(tasks);
    }
    
    // 7. Update Status
    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(
            @PathVariable String id,
            @RequestBody UpdateStatusRequest request) {
        Appointment appointment = appointmentService.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(appointment);
    }
}
```

### Service Example
```java
@Service
public class AppointmentService {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    private static final int MAX_DAILY_APPOINTMENTS = 50;
    private static final int MAX_PER_SLOT = 3;
    
    public DailyLimitResponse checkDailyLimit(String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        
        // Count total appointments
        long totalCount = appointmentRepository.countByDate(appointmentDate);
        
        // Count by vehicle type
        Map<String, Long> vehicleCounts = appointmentRepository
            .countByDateGroupByVehicleType(appointmentDate);
        
        // Build response
        DailyLimitResponse response = new DailyLimitResponse();
        response.setDate(date);
        response.setTotalAppointments((int) totalCount);
        response.setMaxAppointments(MAX_DAILY_APPOINTMENTS);
        response.setCanBookMore(totalCount < MAX_DAILY_APPOINTMENTS);
        
        // Vehicle limits
        Map<String, VehicleLimit> vehicleLimits = new HashMap<>();
        vehicleLimits.put("car", new VehicleLimit(
            vehicleCounts.getOrDefault("car", 0L).intValue(), 20));
        vehicleLimits.put("suv", new VehicleLimit(
            vehicleCounts.getOrDefault("suv", 0L).intValue(), 15));
        // ... add other vehicle types
        
        response.setVehicleLimits(vehicleLimits);
        return response;
    }
    
    public List<TimeSlot> getAvailableSlots(String date, String vehicleType) {
        LocalDate appointmentDate = LocalDate.parse(date);
        
        // Define time slots
        String[] timeSlots = {
            "09:00-10:00", "10:00-11:00", "11:00-12:00",
            "12:00-13:00", "13:00-14:00", "14:00-15:00",
            "15:00-16:00", "16:00-17:00"
        };
        
        // Count appointments per slot
        Map<String, Long> slotCounts = appointmentRepository
            .countByDateGroupByTimeSlot(appointmentDate);
        
        // Build response
        List<TimeSlot> result = new ArrayList<>();
        for (String slot : timeSlots) {
            long count = slotCounts.getOrDefault(slot, 0L);
            result.add(new TimeSlot(
                slot,
                count < MAX_PER_SLOT,
                (int) (MAX_PER_SLOT - count)
            ));
        }
        
        return result;
    }
    
    @Transactional
    public Appointment createAppointment(CreateAppointmentRequest request, 
                                         UserDetails userDetails) {
        // Validation
        validateAppointment(request);
        
        // Create appointment
        Appointment appointment = new Appointment();
        appointment.setUserId(userDetails.getUsername());
        appointment.setUserName(userDetails.getName());
        appointment.setUserEmail(userDetails.getEmail());
        appointment.setVehicleType(request.getVehicleType());
        appointment.setDate(LocalDate.parse(request.getDate()));
        appointment.setTimeSlot(request.getTimeSlot());
        appointment.setServiceType(request.getServiceType());
        appointment.setDescription(request.getDescription());
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setCreatedAt(LocalDateTime.now());
        appointment.setUpdatedAt(LocalDateTime.now());
        
        return appointmentRepository.save(appointment);
    }
}
```

---

## Database Schema

### PostgreSQL
```sql
CREATE TABLE appointments (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL CHECK (vehicle_type IN ('car', 'suv', 'truck', 'motorcycle', 'van')),
    date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in-progress', 'completed', 'cancelled')),
    assigned_employee_id VARCHAR(255),
    assigned_employee_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_employee_id ON appointments(assigned_employee_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date_time ON appointments(date, time_slot);

-- Composite index for employee tasks
CREATE INDEX idx_appointments_employee_status ON appointments(assigned_employee_id, status);
```

### MongoDB
```javascript
// Collection: appointments
const appointmentSchema = {
  _id: ObjectId,
  userId: String,
  userName: String,
  userEmail: String,
  vehicleType: {
    type: String,
    enum: ['car', 'suv', 'truck', 'motorcycle', 'van']
  },
  date: String, // ISO date (YYYY-MM-DD)
  timeSlot: String,
  serviceType: String,
  description: String,
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedEmployeeId: String,
  assignedEmployeeName: String,
  createdAt: Date,
  updatedAt: Date
};

// Indexes
db.appointments.createIndex({ date: 1 });
db.appointments.createIndex({ userId: 1 });
db.appointments.createIndex({ assignedEmployeeId: 1, status: 1 });
db.appointments.createIndex({ date: 1, timeSlot: 1 });
```

---

## Validation Logic

### Business Rules
```javascript
// Constants
const MAX_DAILY_APPOINTMENTS = 50;
const MAX_PER_SLOT = 3;
const VEHICLE_LIMITS = {
  car: 20,
  suv: 15,
  truck: 10,
  motorcycle: 8,
  van: 7
};

const TIME_SLOTS = [
  '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '12:00-13:00', '13:00-14:00', '14:00-15:00',
  '15:00-16:00', '16:00-17:00'
];

// Validation function
async function validateAppointment(appointmentData) {
  const { date, vehicleType, timeSlot } = appointmentData;
  
  // 1. Check date is not in the past
  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (appointmentDate < today) {
    throw new Error('Cannot book appointments in the past');
  }
  
  // 2. Check valid time slot
  if (!TIME_SLOTS.includes(timeSlot)) {
    throw new Error('Invalid time slot');
  }
  
  // 3. Check daily limit
  const dailyCount = await countAppointmentsByDate(date);
  if (dailyCount >= MAX_DAILY_APPOINTMENTS) {
    throw new Error('Daily appointment limit reached');
  }
  
  // 4. Check vehicle type limit
  const vehicleCount = await countAppointmentsByDateAndVehicle(date, vehicleType);
  if (vehicleCount >= VEHICLE_LIMITS[vehicleType]) {
    throw new Error(`Daily limit for ${vehicleType} reached`);
  }
  
  // 5. Check time slot availability
  const slotCount = await countAppointmentsByDateAndSlot(date, timeSlot);
  if (slotCount >= MAX_PER_SLOT) {
    throw new Error('Time slot is full');
  }
  
  return true;
}
```

---

## Testing with Sample Data

### Sample Appointments
```json
[
  {
    "id": "apt-001",
    "userId": "user_123",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "vehicleType": "car",
    "date": "2025-11-05",
    "timeSlot": "09:00-10:00",
    "serviceType": "Oil Change",
    "description": "Regular maintenance",
    "status": "pending",
    "createdAt": "2025-11-01T10:00:00Z",
    "updatedAt": "2025-11-01T10:00:00Z"
  },
  {
    "id": "apt-002",
    "userId": "user_456",
    "userName": "Jane Smith",
    "userEmail": "jane@example.com",
    "vehicleType": "suv",
    "date": "2025-11-05",
    "timeSlot": "10:00-11:00",
    "serviceType": "Brake Repair",
    "description": "Squeaking noise when braking",
    "status": "assigned",
    "assignedEmployeeId": "emp_789",
    "assignedEmployeeName": "Mike Johnson",
    "createdAt": "2025-11-01T11:00:00Z",
    "updatedAt": "2025-11-01T14:00:00Z"
  }
]
```

---

## Error Handling Best Practices

```javascript
// Error response format
{
  "success": false,
  "message": "Error message here",
  "code": "ERROR_CODE",
  "details": {} // Optional additional info
}

// Error codes
const ERROR_CODES = {
  DAILY_LIMIT_REACHED: 'DAILY_LIMIT_REACHED',
  VEHICLE_LIMIT_REACHED: 'VEHICLE_LIMIT_REACHED',
  SLOT_FULL: 'SLOT_FULL',
  INVALID_DATE: 'INVALID_DATE',
  INVALID_SLOT: 'INVALID_SLOT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND'
};
```

---

## 🎯 Next Steps

1. Choose your backend stack (Node.js or Java)
2. Set up database with provided schema
3. Implement the endpoints using examples above
4. Test each endpoint with sample data
5. Connect frontend to backend
6. Deploy!
