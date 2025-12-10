# Employee Management System - API Documentation

## Authentication
- `POST /api/auth/signup` - Admin registration
- `POST /api/auth/login` - Login for both Admin & Employee (returns JWT token)

## Admin APIs (JWT Required)
- `GET /api/admin/me` - Get admin profile
- `PUT /api/admin/location` - Set company location (lat, lng)
- `POST /api/admin/employee` - Create new employee (sends login credentials via email)
- `GET /api/admin/employees` - List all employees
- `PUT /api/admin/employee/:id` - Update employee details
- `DELETE /api/admin/employee/:id` - Delete employee
- `GET /api/admin/dashboard` - Dashboard with presence/leave status

## Employee APIs (JWT Required)
- `POST /api/employee/punch` - Punch IN/OUT with location validation
- `POST /api/employee/leave` - Apply for leave
- `GET /api/employee/punches/:employee_id` - Get punch history
- `GET /api/employee/leaves` - Get own leave history
- `GET /api/employee/profile` - Get own profile
- `PUT /api/employee/profile` - Update own profile (name, phone, profile_photo)
- `GET /api/employee/alldata` - Admin only: Get all employees with punches & leaves

## Leave Management (Admin Only)
- `POST /api/leave/decide/:id` - Approve/reject leave (sends email notification)

## Features Implemented

### 1. Complete Employee Management
- ✅ Create, Read, Update, Delete employees
- ✅ Employee profile management
- ✅ Automatic password generation & email sending

### 2. Attendance System
- ✅ Location-based punch in/out
- ✅ Real-time attendance tracking
- ✅ Daily presence status

### 3. Leave Management
- ✅ Apply leave with date range calculation
- ✅ Admin approval/rejection workflow
- ✅ Email notifications for leave decisions
- ✅ Leave status tracking

### 4. Admin Dashboard
- ✅ Real-time employee presence status
- ✅ Today's attendance summary
- ✅ Pending leave requests count
- ✅ Employee statistics (Present/Absent/On Leave)

### 5. Security & Authentication
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Admin-only endpoints protection
- ✅ Employee data isolation by admin

## Dashboard Data Structure
```json
{
  "summary": {
    "totalEmployees": 10,
    "present": 7,
    "absent": 2,
    "onLeave": 1,
    "pendingLeaves": 3
  },
  "employees": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "emp_id": "EMP001",
      "department": "IT",
      "job_role": "Developer",
      "status": "Present",
      "attendance": {
        "punchedIn": true,
        "punchedOut": false,
        "punchInTime": 1640995200000,
        "punchOutTime": null
      },
      "leaves": {
        "active": 0,
        "pending": 1,
        "total": 5
      }
    }
  ]
}
```

## Flow Summary
1. **Admin** creates account via signup
2. **Admin** logs in → gets JWT token
3. **Admin** creates employees → employees get login credentials via email
4. **Employee** logs in → gets JWT token
5. **Employee** can punch in/out, apply leaves, update profile
6. **Admin** can view dashboard, manage employees, approve leaves
7. **Email notifications** sent for leave decisions

All APIs are protected with JWT middleware and role-based access control!
