import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/health
 * Health check endpoint - tests database connection
 */
export async function GET() {
  try {
    // Check if DATABASE_URL is set
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    
    if (!hasDatabaseUrl) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'DATABASE_URL environment variable is not set',
          database: 'not_configured',
        },
        { status: 500 }
      )
    }

    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`
      
      // Try to count users to verify tables exist
      const userCount = await prisma.user.count()
      
      return NextResponse.json({
        status: 'healthy',
        message: 'Database connection successful',
        database: 'connected',
        tablesExist: true,
        userCount,
        environment: process.env.NODE_ENV,
        hasDatabaseUrl: true,
      })
    } catch (dbError: any) {
      const errorMessage = dbError?.message || 'Unknown database error'
      
      // Check for specific error codes
      if (errorMessage.includes('P1001') || errorMessage.includes("Can't reach database")) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Cannot reach database server',
            database: 'connection_failed',
            error: errorMessage,
            hint: 'Check your DATABASE_URL and ensure the database server is accessible',
          },
          { status: 500 }
        )
      }
      
      if (errorMessage.includes('P1003') || errorMessage.includes('does not exist')) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Database or tables do not exist',
            database: 'tables_missing',
            error: errorMessage,
            hint: 'Run "npx prisma db push" to create the tables',
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database connection failed',
          database: 'error',
          error: errorMessage,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Health check failed',
        database: 'unknown_error',
      },
      { status: 500 }
    )
  }
}
