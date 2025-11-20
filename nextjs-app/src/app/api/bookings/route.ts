import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookings)
  } catch (error: any) {
    console.error('Get bookings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Check for duplicates
    const existing = await prisma.booking.findFirst({
      where: {
        name: { equals: data.name, mode: 'insensitive' },
        date: data.date,
        time: data.time,
        service: { equals: data.service, mode: 'insensitive' },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Duplicate booking detected' },
        { status: 409 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        name: data.name,
        address: data.address,
        date: data.date,
        time: data.time,
        service: data.service,
        details: data.details,
        status: data.status || 'pending',
        amount: data.amount || 0,
      },
    })

    return NextResponse.json(
      {
        message: 'Booking created',
        booking,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

