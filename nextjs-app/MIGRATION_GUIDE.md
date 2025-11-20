# Migration Guide: Flask/Vanilla JS → Next.js 14

This guide explains how to migrate from the old Flask/Vanilla JS app to the new Next.js app.

## What's Changed

### Backend (Flask → Next.js API Routes)

**Old Structure:**
```
backend/
├── app.py (single file with all routes)
└── requirements.txt
```

**New Structure:**
```
nextjs-app/
├── src/app/api/          # API routes (replaces Flask routes)
│   ├── service-requests/
│   ├── providers/
│   ├── auth/
│   └── ...
├── prisma/
│   └── schema.prisma     # Database schema (replaces SQLAlchemy models)
└── src/lib/
    ├── prisma.ts         # Prisma client
    └── email.ts          # Email utilities
```

### Frontend (Vanilla JS → React/TypeScript)

**Old Structure:**
```
house-hero-app/public/
├── index.html
├── pages/
│   ├── bookings/
│   │   └── book-service.html
│   └── dashboard/
│       └── admin-dashboard.html
└── js/
    ├── config.js
    └── script.js
```

**New Structure:**
```
nextjs-app/src/
├── app/                  # Next.js pages (App Router)
│   ├── page.tsx          # Home page
│   ├── book-service/
│   │   └── page.tsx      # Booking page
│   └── admin/
│       └── page.tsx      # Admin dashboard
├── components/           # Reusable React components
├── hooks/                # Custom React hooks
└── lib/
    └── api.ts            # API client
```

## Key Differences

### 1. Database Access

**Old (Flask/SQLAlchemy):**
```python
from app import db
booking = Booking.query.filter_by(id=1).first()
```

**New (Next.js/Prisma):**
```typescript
import { prisma } from '@/lib/prisma'
const booking = await prisma.booking.findUnique({ where: { id: 1 } })
```

### 2. API Routes

**Old (Flask):**
```python
@app.route('/api/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    # ...
    return jsonify({'message': 'success'})
```

**New (Next.js):**
```typescript
// src/app/api/bookings/route.ts
export async function POST(request: NextRequest) {
  const data = await request.json()
  // ...
  return NextResponse.json({ message: 'success' })
}
```

### 3. Frontend API Calls

**Old (Vanilla JS):**
```javascript
fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
```

**New (React/TanStack Query):**
```typescript
import { useMutation } from '@tanstack/react-query'
import { serviceRequestApi } from '@/lib/api'

const mutation = useMutation({
  mutationFn: serviceRequestApi.create,
  onSuccess: (data) => {
    // Handle success
  }
})
```

### 4. State Management

**Old:**
- Local storage
- Global variables
- DOM manipulation

**New:**
- Zustand for global state
- TanStack Query for server state
- React hooks for component state

### 5. Routing

**Old:**
- HTML files with relative paths
- Manual navigation with `window.location`

**New:**
- Next.js App Router
- `<Link>` components
- `useRouter()` hook

## Migration Steps

1. **Set up the new project:**
   ```bash
   cd nextjs-app
   npm install
   ```

2. **Configure database:**
   - Set `DATABASE_URL` in `.env`
   - Run `npm run db:push` to create tables

3. **Migrate data (if needed):**
   - Export data from old SQLite/PostgreSQL database
   - Import into new PostgreSQL database
   - Or use Prisma migrations

4. **Test API endpoints:**
   - All endpoints should work the same
   - URLs are the same (`/api/service-requests`, etc.)

5. **Update frontend:**
   - Convert HTML pages to React components
   - Replace vanilla JS with React hooks
   - Use TanStack Query for data fetching

## API Compatibility

All API endpoints maintain the same structure:

- ✅ `/api/service-requests` - Same request/response format
- ✅ `/api/pricing` - Same format
- ✅ `/api/providers` - Same format
- ✅ `/api/auth/login` - Same format
- ✅ `/api/auth/signup` - Same format

## Benefits of Migration

1. **Type Safety**: Full TypeScript support
2. **Better DX**: Hot reload, better error messages
3. **Performance**: Server-side rendering, optimized builds
4. **Maintainability**: Better code organization
5. **Scalability**: Easier to add features
6. **Deployment**: One-click Vercel deployment

## Need Help?

- Check the README.md for setup instructions
- Review the API routes in `src/app/api/`
- Check React components in `src/components/`
- See TypeScript types in `src/types/`

