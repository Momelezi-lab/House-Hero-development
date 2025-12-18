# Booking Flow Migration Guide

## Overview

The booking system has been updated to implement a **controlled broadcast + manual approval** system where:
1. Bookings are broadcasted to all providers
2. Providers can show interest (not auto-assigned)
3. Admin manually confirms the final assignment
4. Once assigned, booking disappears from other providers' dashboards

## Database Schema Changes

### New Fields Added to `ServiceRequest`:

1. **`interestedProviders`** (String, JSON)
   - Stores array of providers who showed interest
   - Format: `[{providerId, providerName, providerEmail, providerPhone, providerRating, acceptedAt}]`

2. **`assignedAt`** (DateTime, nullable)
   - Timestamp when admin assigned the provider

3. **`assignedBy`** (String, nullable)
   - Email of admin who made the assignment

4. **`auditLog`** (String, JSON)
   - Tracks all actions: provider interests, assignments, rejections
   - Format: `[{action, userId/providerId, timestamp, details}]`

### Status Flow:

```
PENDING → BROADCASTED → INTERESTED → ASSIGNED → IN_PROGRESS → COMPLETED
                                                      ↓
                                                  CANCELLED
```

## Migration Steps

### 1. Update Database Schema

Run Prisma migration:

```bash
cd nextjs-app
npx prisma migrate dev --name add_booking_flow_fields
```

Or if using `db push`:

```bash
npx prisma db push
```

### 2. Update Existing Bookings

Existing bookings with status "pending" should be updated to "broadcasted":

```sql
UPDATE service_requests 
SET status = 'broadcasted' 
WHERE status = 'pending' AND assigned_provider_id IS NULL;
```

Or via Prisma Studio/script:

```typescript
await prisma.serviceRequest.updateMany({
  where: {
    status: 'pending',
    assignedProviderId: null,
  },
  data: {
    status: 'broadcasted',
  },
})
```

## New API Endpoints

### 1. Show Interest
- **POST** `/api/service-requests/[id]/show-interest`
- Body: `{ providerId: number }`
- Adds provider to interestedProviders array
- Updates status: `pending` → `broadcasted` → `interested`

### 2. Assign Provider (Admin)
- **POST** `/api/service-requests/[id]/assign-provider`
- Body: `{ providerId: number, adminEmail: string }`
- Confirms assignment, sets status to `assigned`
- Removes booking from other providers' dashboards
- Sends notifications

### 3. Reject Provider (Admin)
- **DELETE** `/api/service-requests/[id]/assign-provider?providerId=X&adminEmail=Y`
- Removes provider from interestedProviders
- Updates status if no more interested providers

## Provider Dashboard Changes

### Available Jobs Section:
- Shows all `broadcasted`, `interested`, or `pending` jobs
- Button: "Accept Job" (shows interest, doesn't auto-assign)
- After showing interest: Button disabled, shows "Interest Submitted. Awaiting confirmation."
- Auto-refreshes every 5 seconds

### Accepted Jobs Section:
- Shows jobs where `providerEmail` matches logged-in provider
- Only shows jobs with status `assigned` or higher

## Admin Dashboard Changes

### Request Details Modal:
- **Interested Providers Section**: Shows all providers who showed interest
  - Provider name, email, phone
  - Rating (if available)
  - Timestamp of interest
  - "Confirm" button (assigns provider)
  - "Reject" button (removes from interested list)

- **Status Options**: Updated to include all new statuses
  - pending, broadcasted, interested, assigned, in_progress, completed, cancelled

- **Manual Override**: Admin can still manually assign any provider (bypasses interest system)

## Testing Checklist

- [ ] Create a new booking → Should start as `broadcasted`
- [ ] Provider A shows interest → Status changes to `interested`, appears in admin modal
- [ ] Provider B shows interest → Also appears in interested list
- [ ] Admin confirms Provider A → Status changes to `assigned`, disappears from Provider B's dashboard
- [ ] Provider B tries to show interest again → Error: "already shown interest"
- [ ] Admin rejects Provider B → Removed from list, booking remains available
- [ ] Audit log tracks all actions

## Rollback Plan

If you need to rollback:

1. Revert schema changes:
```bash
git checkout HEAD~1 prisma/schema.prisma
npx prisma migrate dev
```

2. Remove new endpoints:
- Delete `/api/service-requests/[id]/show-interest`
- Delete `/api/service-requests/[id]/assign-provider`

3. Revert provider dashboard to use old accept endpoint

## Notes

- The old `/api/service-requests/[id]/accept` endpoint still exists but is not used
- Admin can still manually assign via the modal (override)
- Email notifications are sent when provider is assigned
- Non-selected providers receive notification emails

