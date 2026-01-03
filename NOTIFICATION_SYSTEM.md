# Notification System Documentation

This document describes the Firebase Cloud Messaging (FCM) notification system implementation for the Employee Management System.

## Overview

The notification system provides real-time push notifications to users (admins and employees) for various events:
- **PUNCH_IN**: When an employee punches in (notifies admin)
- **LEAVE_REQUEST**: When an employee requests leave (notifies admin)
- **LEAVE_APPROVED**: When a leave request is approved (notifies employee)
- **LEAVE_REJECTED**: When a leave request is rejected (notifies employee)

## Database Schema

### 1. `user_device_tokens` Table

Stores FCM tokens for push notifications. Each user can have multiple devices (multiple tokens).

```sql
CREATE TABLE `user_device_tokens` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `user_id` CHAR(36) NOT NULL COMMENT 'UUID of user (employee or admin)',
  `fcm_token` TEXT NOT NULL UNIQUE COMMENT 'Firebase Cloud Messaging token',
  `platform` VARCHAR(50) NOT NULL DEFAULT 'android' COMMENT 'Platform: android, ios, web',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_user_id` (`user_id`),
  UNIQUE KEY `idx_fcm_token` (`fcm_token`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Notes:**
- `user_id` can reference either an employee or admin
- `fcm_token` is unique to prevent duplicates
- Multiple tokens per user are allowed (multiple devices)

### 2. `notifications` Table

Stores notification records for tracking and displaying in-app notifications.

```sql
CREATE TABLE `notifications` (
  `id` CHAR(36) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL COMMENT 'Notification title',
  `message` TEXT NOT NULL COMMENT 'Notification message body',
  `type` ENUM('PUNCH_IN', 'LEAVE_REQUEST', 'LEAVE_APPROVED', 'LEAVE_REJECTED') NOT NULL COMMENT 'Type of notification',
  `sender_user_id` CHAR(36) NOT NULL COMMENT 'UUID of user who triggered the notification',
  `receiver_user_id` CHAR(36) NOT NULL COMMENT 'UUID of user who receives the notification',
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Whether the notification has been read',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_receiver_user_id` (`receiver_user_id`),
  INDEX `idx_type` (`type`),
  INDEX `idx_is_read` (`is_read`),
  INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Notification Types:**
- `PUNCH_IN`: Employee punches in → Admin receives notification
- `LEAVE_REQUEST`: Employee requests leave → Admin receives notification
- `LEAVE_APPROVED`: Admin approves leave → Employee receives notification
- `LEAVE_REJECTED`: Admin rejects leave → Employee receives notification

## API Endpoints

### 1. Save Device Token

**POST** `/api/user/device-token`

Save or update FCM token for the authenticated user.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body:**
```json
{
  "fcm_token": "dKjXyZ123...",
  "platform": "android" // optional: "android" | "ios" | "web"
}
```

**Response:**
```json
{
  "status_code": 200,
  "message": "Device token saved successfully",
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "fcm_token": "dKjXyZ123...",
    "platform": "android",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Get All Notifications

**GET** `/api/user/notifications`

Get all notifications for the authenticated user (ordered by created_at DESC).

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "status_code": 200,
  "data": [
    {
      "id": "uuid",
      "title": "New Punch In",
      "message": "John Doe has punched in",
      "type": "PUNCH_IN",
      "sender_user_id": "uuid",
      "receiver_user_id": "uuid",
      "is_read": false,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Get Unread Notifications

**GET** `/api/user/notifications/unread`

Get unread notifications for the authenticated user.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "status_code": 200,
  "data": [
    {
      "id": "uuid",
      "title": "New Punch In",
      "message": "John Doe has punched in",
      "type": "PUNCH_IN",
      "sender_user_id": "uuid",
      "receiver_user_id": "uuid",
      "is_read": false,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 4. Mark Notification as Read

**PATCH** `/api/user/notifications/:id/read`

Mark a specific notification as read.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "status_code": 200,
  "message": "Notification marked as read",
  "data": {
    "id": "uuid",
    "title": "New Punch In",
    "message": "John Doe has punched in",
    "type": "PUNCH_IN",
    "sender_user_id": "uuid",
    "receiver_user_id": "uuid",
    "is_read": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Mark All Notifications as Read

**PATCH** `/api/user/notifications/read-all`

Mark all notifications as read for the authenticated user.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "status_code": 200,
  "message": "All notifications marked as read"
}
```

## Firebase Configuration

### Environment Variables

You need to configure Firebase Admin SDK using one of the following methods:

**Option 1: Service Account JSON (Recommended)**
```env
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"your-project-id",...}'
```

**Option 2: Individual Fields**
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Either:
   - Set `FIREBASE_SERVICE_ACCOUNT_KEY` to the entire JSON content as a string, OR
   - Extract `project_id`, `client_email`, and `private_key` and set the individual environment variables

## FCM Payload Structure

### Example Push Notification Payload

When a notification is sent via FCM, it uses the following structure:

```json
{
  "notification": {
    "title": "New Punch In",
    "body": "John Doe has punched in"
  },
  "data": {
    "type": "PUNCH_IN",
    "employee_id": "uuid",
    "employee_name": "John Doe",
    "punch_id": "uuid"
  },
  "android": {
    "priority": "high"
  },
  "apns": {
    "headers": {
      "apns-priority": "10"
    }
  }
}
```

### Notification Type Specific Payloads

#### PUNCH_IN
```json
{
  "notification": {
    "title": "New Punch In",
    "body": "John Doe has punched in"
  },
  "data": {
    "type": "PUNCH_IN",
    "employee_id": "uuid",
    "employee_name": "John Doe",
    "punch_id": "uuid"
  }
}
```

#### LEAVE_REQUEST
```json
{
  "notification": {
    "title": "New Leave Request",
    "body": "John Doe has requested leave for 5 day(s)"
  },
  "data": {
    "type": "LEAVE_REQUEST",
    "employee_id": "uuid",
    "employee_name": "John Doe",
    "leave_id": "uuid",
    "days": "5",
    "start_date": "2024-01-15",
    "end_date": "2024-01-19"
  }
}
```

#### LEAVE_APPROVED
```json
{
  "notification": {
    "title": "Leave Approved",
    "body": "Your leave request for 5 day(s) has been approved"
  },
  "data": {
    "type": "LEAVE_APPROVED",
    "leave_id": "uuid",
    "days": "5",
    "start_date": "2024-01-15",
    "end_date": "2024-01-19",
    "status": "approved"
  }
}
```

#### LEAVE_REJECTED
```json
{
  "notification": {
    "title": "Leave Rejected",
    "body": "Your leave request for 5 day(s) has been rejected"
  },
  "data": {
    "type": "LEAVE_REJECTED",
    "leave_id": "uuid",
    "days": "5",
    "start_date": "2024-01-15",
    "end_date": "2024-01-19",
    "status": "rejected"
  }
}
```

## Integration Points

Notifications are automatically sent when:

1. **POST /api/employee/punch** (type: "IN")
   - After punch is saved, admin receives notification

2. **POST /api/employee/leave**
   - After leave is saved, admin receives notification

3. **POST /api/leave/:id/decide** (action: "approve")
   - After leave is approved, employee receives notification

4. **POST /api/leave/:id/decide** (action: "reject")
   - After leave is rejected, employee receives notification

**Important:** Notification failures do NOT break the main API operations. If notification sending fails, it's logged but the main operation (punch, leave request, etc.) still succeeds.

## Architecture

```
┌─────────────────┐
│   Controller    │
└────────┬────────┘
         │
┌────────▼────────┐
│    Service      │
│  (Business      │
│   Logic)        │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐  ┌─▼──────────────┐
│Repo   │  │Notification    │
│       │  │Service         │
└───┬───┘  │  - Create DB   │
    │      │  - Send FCM    │
┌───▼───┐  └─┬──────────────┘
│Database│   │
└────────┘   │
          ┌─▼────┐
          │Firebase│
          │  FCM   │
          └────────┘
```

## Error Handling

- Notification failures are caught and logged but don't throw errors
- Invalid FCM tokens are automatically removed from the database
- Firebase initialization failures are logged but don't prevent server startup
- The system gracefully degrades: if Firebase is not configured, notifications are stored in DB but push notifications are skipped

## Testing

1. **Save Device Token:**
   ```bash
   curl -X POST http://localhost:3000/api/user/device-token \
     -H "Authorization: Bearer <JWT_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"fcm_token": "your-fcm-token", "platform": "android"}'
   ```

2. **Trigger Notification:**
   - Punch in as an employee (admin should receive notification)
   - Request leave as an employee (admin should receive notification)
   - Approve/reject leave as admin (employee should receive notification)

3. **Check Notifications:**
   ```bash
   curl -X GET http://localhost:3000/api/user/notifications \
     -H "Authorization: Bearer <JWT_TOKEN>"
   ```

## Notes

- Notifications are stored in the database AND sent via FCM in the same API call
- Multiple devices per user are supported
- Token management: Invalid tokens are automatically cleaned up
- The system is designed to be resilient: notification failures don't break core functionality


