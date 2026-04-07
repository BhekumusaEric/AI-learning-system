# API Reference: SAAIO Training Grounds

This document provides a technical specification of the REST API endpoints available within the SAAIO Training Grounds ecosystem.

## Authentication and Session Management

### Student Authentication
Initial verification and session establishment for learners.
- **Endpoint**: `POST /api/auth/student-login`
- **Payload**:
  ```json
  {
    "login_id": "string",
    "platform": "saaio" | "dip" | "wrp"
  }
  ```
- **Description**: Validates the Login ID against the specified platform database. Upon success, sets an encrypted session cookie.

### ID Verification
Lightweight existence check for student IDs.
- **Endpoint**: `POST /api/auth/verify`
- **Payload**: `{ "login_id": "string", "platform": "string" }`

---

## Administrative and Onboarding Services
Access to these endpoints requires an active `admin_session` cookie.

### Application Pipeline
Retrieves and processes pending student applications from the integrated AWS cloud service.
- **Endpoint**: `GET /api/admin/applications`
- **Headers**: `Cookie: admin_session=admin:[PASSWORD]`
- **Response Schema**:
  ```json
  {
    "groups": [
      {
        "id": "string",
        "program": "string",
        "campus": "string",
        "students": [
          {
            "Full_Name": "string",
            "Email_Address": "string",
            "alreadyEnrolled": "boolean"
          }
        ]
      }
    ],
    "total": "number"
  }
  ```

### Automated Onboarding
Triggers bulk student registration, cohort assignment, and credential distribution.
- **Endpoint**: `POST /api/admin/onboard`
- **Payload**:
  ```json
  {
    "students": "RawApplication[]",
    "cohortName": "string",
    "program": "string"
  }
  ```
- **Internal Action**: Generates unique Login IDs, creates database records, and initiates automated onboarding emails via the Resend API.

---

## Progress Tracking and Persistence

### Synchronize Progress
Updates the lesson completion matrix for a specific learner.
- **Endpoint**: `POST /api/progress`
- **Payload**:
  ```json
  {
    "username": "string",
    "completedPages": {
       "page_id": "boolean"
    }
  }
  ```

### Retrieve Progress
Fetches the current completion state for a student.
- **Endpoint**: `GET /api/progress?username=[LOGIN_ID]`

---

## Infrastructure Dependencies

### External AWS API
- **URL**: `https://c66cbjnqn1.execute-api.af-south-1.amazonaws.com/idc/applications`
- **Security**: Requires `X-Origin-Verify` header containing the system verification key.

### SMTP Integration
- **Service**: Resend
- **Role**: Automated distribution of onboarding credentials and password recovery tokens.

---

> [!IMPORTANT]
> **Data Integrity**: The Onboarding Pipeline utilizes a secondary cross-check against all local student tables to detect and flag existing email addresses, ensuring that duplicate registration attempts are intercepted before record creation.
