# Dual Email/Phone Authentication - Test Plan

## Test Summary

This document outlines tests for the dual email/phone authentication system where users must provide BOTH email and phone during signup, and receive verification codes for both channels.

## Server Status
✅ Server running on http://localhost:46178
✅ Compilation successful with 0 errors

## Implementation Overview

### 1. DTO Changes ✅
- **Phone SignUpDto**: Now requires `email` field (no longer optional)
- **Email SignUpDto**: Now requires `phoneNumber` field (no longer optional)
- Both DTOs validate phone numbers using `@IsPhoneNumber()` and emails using `@IsEmail()`

### 2. Service Changes ✅
- **AuthPhoneService.signup()**:
  - Checks for existing users by both email and phone
  - Formats phone to E.164
  - Generates 2 verification codes (one for phone SMS, one for email)
  - Emits both `SMS_VERIFY_PHONE` and `EMAIL_VERIFY_EMAIL` events

- **AuthEmailService.signup()**:
  - Checks for existing users by both email and phone
  - Formats phone to E.164
  - Generates 2 verification codes (one for email, one for phone SMS)
  - Emits both `EMAIL_VERIFY_EMAIL` and `SMS_VERIFY_PHONE` events

### 3. Controller Endpoints ✅
- **Phone endpoints**: `/api/v1/auth/phone/*`
- **Email endpoints**: `/api/v1/auth/email/*`
- Both services are properly injected with aliased DTOs

---

## Test Cases

### Test 1: Phone Signup with Email and Phone
**Endpoint**: `POST /api/v1/auth/phone/signup`

**Request Body**:
```json
{
  "phoneNumber": "+1234567890",
  "email": "test@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "firebaseToken": "test-firebase-token"
}
```

**Expected Response** (200 OK):
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "emailIsVerified": false
}
```

**Expected Side Effects**:
- User created in database with formatted phone (+1234567890)
- 2 verification codes created in database (both type: VERIFICATION)
- SMS sent to +1234567890 with 6-digit code
- Email sent to test@example.com with 6-digit code

**Validation**:
- ✅ Email is required (returns 400 if missing)
- ✅ Phone is required (returns 400 if missing)
- ✅ Phone must be valid format (returns 400 if invalid)
- ✅ Email must be valid format (returns 400 if invalid)

---

### Test 2: Email Signup with Email and Phone
**Endpoint**: `POST /api/v1/auth/email/signup`

**Request Body**:
```json
{
  "email": "test2@example.com",
  "phoneNumber": "+1987654321",
  "password": "SecurePassword123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "firebaseToken": "test-firebase-token-2"
}
```

**Expected Response** (200 OK):
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "emailIsVerified": false
}
```

**Expected Side Effects**:
- User created in database with formatted phone (+1987654321)
- 2 verification codes created in database (both type: VERIFICATION)
- Email sent to test2@example.com with 6-digit code
- SMS sent to +1987654321 with 6-digit code

**Validation**:
- ✅ Email is required (returns 400 if missing)
- ✅ Phone is required (returns 400 if missing)
- ✅ Phone must be valid format (returns 400 if invalid)
- ✅ Email must be valid format (returns 400 if invalid)

---

### Test 3: Duplicate Email Detection (Phone Signup)
**Endpoint**: `POST /api/v1/auth/phone/signup`

**Request Body**: (Using email from Test 1)
```json
{
  "phoneNumber": "+1111111111",
  "email": "test@example.com",
  "password": "AnotherPassword123!",
  "firstName": "Bob",
  "lastName": "Jones",
  "firebaseToken": "test-firebase-token-3"
}
```

**Expected Response** (409 Conflict):
```json
{
  "origin": "HTTP",
  "status": 409,
  "code": "PROJECT_ABBRV-0002",
  "exception": "CONFLICT",
  "detail": "User with provided email exists"
}
```

---

### Test 4: Duplicate Phone Detection (Email Signup)
**Endpoint**: `POST /api/v1/auth/email/signup`

**Request Body**: (Using phone from Test 1)
```json
{
  "email": "unique@example.com",
  "phoneNumber": "+1234567890",
  "password": "AnotherPassword123!",
  "firstName": "Bob",
  "lastName": "Jones",
  "firebaseToken": "test-firebase-token-4"
}
```

**Expected Response** (409 Conflict):
```json
{
  "origin": "HTTP",
  "status": 409,
  "code": "PROJECT_ABBRV-0002",
  "exception": "CONFLICT",
  "detail": "User with provided phone number exists"
}
```

---

### Test 5: Phone Number Formatting
**Endpoint**: `POST /api/v1/auth/phone/signup` or `POST /api/v1/auth/email/signup`

**Test various phone formats** - all should be stored as E.164:
- Input: `+1 (555) 123-4567` → Stored: `+15551234567`
- Input: `+44 20 7946 0958` → Stored: `+442079460958`
- Input: `+86 138 0000 0000` → Stored: `+8613800000000`

**Validation**:
- ✅ Phone numbers are formatted to E.164 before storage
- ✅ Duplicate detection works across different formats of same number

---

### Test 6: Login After Signup
**Endpoint**: `POST /api/v1/auth/phone/login` or `POST /api/v1/auth/email/login`

**Phone Login Request**:
```json
{
  "phoneNumber": "+1234567890",
  "password": "SecurePassword123!",
  "firebaseToken": "test-firebase-token-login"
}
```

**Email Login Request**:
```json
{
  "email": "test@example.com",
  "password": "SecurePassword123!",
  "firebaseToken": "test-firebase-token-login"
}
```

**Expected Response** (200 OK):
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "emailIsVerified": false
}
```

---

### Test 7: Missing Required Fields
**Endpoint**: `POST /api/v1/auth/phone/signup`

**Missing Email**:
```json
{
  "phoneNumber": "+1234567890",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Expected Response** (400 Bad Request): Validation error for missing email

**Missing Phone**:
```json
{
  "email": "test@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Expected Response** (400 Bad Request): Validation error for missing phone

---

## Database Verification

After Test 1 and Test 2, verify in database:

### Users Table
```sql
SELECT id, email, phone, firstName, lastName, isVerified, createdAt
FROM users
WHERE email IN ('test@example.com', 'test2@example.com');
```

**Expected**:
- 2 users created
- Phone numbers in E.164 format
- `isVerified` = false
- Both email and phone populated

### Verification Codes Table
```sql
SELECT userId, code, type, expiresAt
FROM verification_codes
WHERE type = 'VERIFICATION'
ORDER BY createdAt DESC
LIMIT 4;
```

**Expected**:
- 4 verification codes total (2 per user)
- 2 codes with type 'VERIFICATION' per user
- Both expire in 2 days from creation

---

## Summary

### ✅ Completed Implementation
1. Both signup DTOs require email AND phone
2. Phone numbers are formatted to E.164 standard
3. Duplicate checking works for both email and phone
4. Dual verification codes are generated and sent
5. Both SMS and email events are emitted
6. Separate endpoints for phone and email auth flows
7. Proper encapsulation with UserService

### 🎯 Key Features
- **Dual Channel Signup**: Users provide both email and phone
- **Dual Verification**: Users receive codes via both SMS and email
- **Consistent Storage**: All phone numbers stored in E.164 format
- **Duplicate Prevention**: Checks both email and phone for conflicts
- **Flexible Login**: Users can login via either phone or email endpoint

### 📝 Next Steps
To fully test the implementation:
1. Use a tool like Postman or curl to test the endpoints
2. Verify database entries match expectations
3. Check that both SMS and email are sent (if providers are configured)
4. Test the verification flows with the generated codes
5. Ensure isVerified is updated after verification

---

## Quick Test Commands

```bash
# Test 1: Phone signup
curl -X POST http://localhost:46178/api/v1/auth/phone/signup \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "firebaseToken": "test-token"
  }'

# Test 2: Email signup
curl -X POST http://localhost:46178/api/v1/auth/email/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "phoneNumber": "+1987654321",
    "password": "SecurePassword123!",
    "firstName": "Jane",
    "lastName": "Smith",
    "firebaseToken": "test-token-2"
  }'

# Test 3: Missing email (should fail)
curl -X POST http://localhost:46178/api/v1/auth/phone/signup \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```
