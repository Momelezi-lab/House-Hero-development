# House Hero - Next.js App

Modern full-stack application built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Email**: Nodemailer

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database (local or cloud)
- Email credentials (Gmail or SMTP)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your:
   - `DATABASE_URL` - PostgreSQL connection string
   - Email credentials (MAIL_USERNAME, MAIL_PASSWORD, etc.)
   - `ADMIN_EMAIL` - Admin email address

3. **Set up the database:**
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database (creates tables)
   npm run db:push
   
   # Or run migrations
   npm run db:migrate
   ```

4. **Seed pricing data (optional):**
   - The pricing data will be seeded automatically on first API call
   - Or use the `/api/admin/seed-pricing` endpoint

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nextjs-app/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── (pages)/            # Page routes
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   ├── lib/                    # Utilities
│   ├── hooks/                  # Custom hooks
│   ├── store/                  # Zustand stores
│   ├── api/                    # API client & queries
│   └── types/                  # TypeScript types
└── public/                     # Static assets
```

## Database Setup

### Using Vercel Postgres

1. Create a Vercel Postgres database
2. Copy the connection string to `DATABASE_URL`
3. Run `npm run db:push`

### Using Supabase

1. Create a Supabase project
2. Copy the connection string to `DATABASE_URL`
3. Run `npm run db:push`

### Using Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb house_hero`
3. Set `DATABASE_URL="postgresql://user:password@localhost:5432/house_hero"`
4. Run `npm run db:push`

## Features

- ✅ Dynamic pricing system with 10% commission
- ✅ Service request booking with real-time calculations
- ✅ Admin dashboard for managing requests
- ✅ Provider management
- ✅ Email notifications
- ✅ Financial reports
- ✅ R100 callout fee

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/pricing` - Get pricing data
- `POST /api/service-requests` - Create service request
- `GET /api/service-requests` - Get all requests
- `GET /api/service-requests/[id]` - Get single request
- `PATCH /api/service-requests/[id]` - Update request
- `GET /api/providers` - Get all providers
- `POST /api/providers` - Create provider
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Development

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:studio` - Open Prisma Studio

## Migration from Flask/Vanilla JS

This is a complete rewrite of the original Flask/Vanilla JS app. Key improvements:

1. **Type Safety**: Full TypeScript support
2. **Modern React**: Server components, App Router
3. **Better DX**: Hot reload, better error messages
4. **Unified Codebase**: Frontend and backend in one repo
5. **Better Performance**: Server-side rendering, optimized builds
6. **Easier Deployment**: One-click Vercel deployment

