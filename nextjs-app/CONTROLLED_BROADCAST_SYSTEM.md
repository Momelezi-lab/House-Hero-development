# Controlled Broadcast + Manual Approval System

## Overview

This system implements a **quality-first, admin-controlled** booking dispatch system where:
- Bookings are broadcasted to all providers
- Providers show interest (not auto-assigned)
- Admin manually confirms the final assignment
- Once assigned, booking disappears from other providers' dashboards

## Status Flow

```
PENDING → BROADCASTED → INTERESTED → ASSIGNED → IN_PROGRESS → COMPLETED
                                                      ↓
                                                  CANCELLED
```

### Status Definitions:
- **PENDING**: Booking created, not yet broadcasted
- **BROADCASTED**: Visible to all providers, accepting interest
- **INTERESTED**: One or more providers have shown interest
- **ASSIGNED**: Admin confirmed provider assignment
- **IN_PROGRESS**: Service is being performed
- **COMPLETED**: Service finished
- **CANCELLED**: Booking cancelled

## Database Schema Changes

### New Fields in `ServiceRequest`:

1. **`interestedProviders`** (String, JSON)
   - Array of providers who showed interest
   - Format: `[{providerId, providerName, providerEmail, providerPhone, providerRating, acceptedAt}]`

2. **`assignedAt`** (DateTime, nullable)
   - Timestamp when admin assigned the provider

3. **`assignedBy`** (String, nullable)
   - Email of admin who made the assignment

4. **`auditLog`** (String, JSON)
   - Complete audit trail of all actions
   - Format: `[{action, userId/providerId, timestamp, details}]`

## API Endpoints

### 1. Show Interest (Provider)
**POST** `/api/service-requests/[id]/show-interest`
- Body: `{ providerId: number }`
- Adds provider to `interestedProviders` array
- Updates status: `pending` → `broadcasted` → `interested`
- Prevents duplicate interests
- Returns: `{ message, request, interestedProviders: count }`

### 2. Assign Provider (Admin)
**POST** `/api/service-requests/[id]/assign-provider`
- Body: `{ providerId: number, adminEmail: string }`
- Confirms assignment, sets status to `assigned`
- Sets `assignedProviderId`, `assignedAt`, `assignedBy`
- Removes booking from other providers' dashboards
- Sends notifications to:
  - Assigned provider
  - Customer
  - Non-selected providers (if any)

### 3. Reject Provider (Admin)
**DELETE** `/api/service-requests/[id]/assign-provider?providerId=X&adminEmail=Y`
- Removes provider from `interestedProviders`
- Updates status to `broadcasted` if no more interested providers
- Logs action in audit log

## Provider Dashboard Behavior

### Available Jobs Section:
- Shows all `broadcasted`, `interested`, or `pending` jobs
- **Full job details displayed:**
  - Customer name and phone
  - Full address (including unit number, complex name)
  - Service details (selected items, quantities)
  - Additional notes
  - Access instructions
  - Provider payout amount
  - Date and time

- **Accept Job Button:**
  - Text: "Accept Job"
  - On click: Shows interest (does NOT auto-assign)
  - After clicking: Button disabled, shows "Interest Submitted. Awaiting confirmation."
  - Auto-refreshes every 5 seconds

### My Accepted Jobs Section:
- Shows jobs where `providerEmail` matches logged-in provider
- Only shows jobs with status `assigned` or higher
- Displays full job details

## Admin Dashboard Behavior

### Request Details Modal:
- **Interested Providers Section** (shown when status is `interested` or `broadcasted`):
  - Lists all providers who showed interest
  - Shows for each provider:
    - Name
    - Email
    - Phone
    - Rating (if available)
    - Timestamp of interest
  - Actions:
    - **"Confirm" button**: Assigns provider, sets status to `assigned`
    - **"Reject" button**: Removes provider from interested list

- **Status Management:**
  - Dropdown includes all statuses: pending, broadcasted, interested, assigned, in_progress, completed, cancelled
  - Manual override available (admin can assign any provider directly)

- **Assigned Provider Display:**
  - Shows assigned provider details if already assigned
  - Shows assignment timestamp

## Safety Rules (Implemented)

✅ Providers see full job details before accepting
✅ Provider cannot accept more than once (checked in backend)
✅ Booking cannot be auto-assigned (only admin can assign)
✅ Admin can override at any time
✅ Booking disappears from other dashboards only after `ASSIGNED` status
✅ Atomic operations prevent race conditions
✅ Audit logging for all actions

## Email Notifications

### When Provider Shows Interest:
- No email sent (silent operation)

### When Admin Assigns Provider:
1. **Assigned Provider**: "You've been assigned this job. Please confirm availability."
2. **Customer**: Provider contact details sent
3. **Non-selected Providers**: "This job has been assigned to another provider."

## Migration Steps

1. **Update Database Schema:**
   ```bash
   cd nextjs-app
   npx prisma migrate dev --name add_controlled_broadcast_system
   ```

2. **Update Existing Bookings:**
   - Convert `pending` bookings to `broadcasted` if not assigned
   - Initialize `interestedProviders` and `auditLog` as empty arrays

3. **Test Flow:**
   - Create booking → Should be `broadcasted`
   - Provider shows interest → Status → `interested`
   - Admin confirms → Status → `assigned`
   - Verify booking disappears from other providers

## Testing Checklist

- [ ] Create booking → Status is `broadcasted`
- [ ] Provider A shows interest → Appears in admin modal, status → `interested`
- [ ] Provider B shows interest → Also appears in list
- [ ] Provider A tries again → Error: "already shown interest"
- [ ] Admin confirms Provider A → Status → `assigned`, disappears from Provider B
- [ ] Provider B tries to show interest → Error: "no longer accepting interest"
- [ ] Admin rejects Provider B → Removed from list, booking remains available
- [ ] Audit log tracks all actions
- [ ] Email notifications sent correctly

## Key Differences from Previous System

| Previous | New System |
|---------|-----------|
| Auto-assign on accept | Manual admin confirmation |
| First-come-first-served | Admin chooses best provider |
| Single provider acceptance | Multiple providers can show interest |
| Immediate assignment | Admin review period |
| Status: pending → confirmed | Status: pending → broadcasted → interested → assigned |

## Notes

- The old `/api/service-requests/[id]/accept` endpoint still exists but is not used
- Admin can still manually assign via modal (bypasses interest system)
- All actions are logged in `auditLog` for dispute resolution
- System prioritizes quality and control over speed

