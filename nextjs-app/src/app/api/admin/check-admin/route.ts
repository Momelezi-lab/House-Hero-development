import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Check if admin user exists in the database
 * GET /api/admin/check-admin?email=admin@homeswift.com
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email') || 'admin@homeswift.com'

    // Test database connection
    try {
      await prisma.$connect()
    } catch (dbError: any) {
      return NextResponse.json({
        connected: false,
        error: 'Database connection failed',
        message: dbError.message,
      }, { status: 500 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        registered: true,
      },
    })

    // Count total users
    const totalUsers = await prisma.user.count()

    return NextResponse.json({
      connected: true,
      userExists: !!user,
      user: user || null,
      totalUsers,
      message: user 
        ? `User ${email} exists with role: ${user.role}`
        : `User ${email} does not exist. Total users in database: ${totalUsers}`,
    })
  } catch (error: any) {
    console.error('Check admin error:', error)
    return NextResponse.json({
      connected: false,
      error: error.message || 'Failed to check admin',
    }, { status: 500 })
  }
}

