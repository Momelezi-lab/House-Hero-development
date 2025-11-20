import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const providers = await prisma.serviceProvider.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(providers)
  } catch (error: any) {
    console.error('Get providers error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const requiredFields = ['name', 'serviceType', 'phone', 'email']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check if email already exists
    const existing = await prisma.serviceProvider.findFirst({
      where: { email: data.email },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    const provider = await prisma.serviceProvider.create({
      data: {
        name: data.name,
        serviceType: data.serviceType,
        phone: data.phone,
        email: data.email,
        address: data.address,
        experienceYears: data.experienceYears || 0,
        hourlyRate: data.hourlyRate || 0,
        rating: data.rating || 0,
        totalBookings: data.totalBookings || 0,
        status: data.status || 'active',
        registered: new Date().toISOString().split('T')[0],
      },
    })

    return NextResponse.json(
      { message: 'Provider created', provider },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create provider error:', error)
    return NextResponse.json(
      { error: 'Failed to create provider' },
      { status: 500 }
    )
  }
}

