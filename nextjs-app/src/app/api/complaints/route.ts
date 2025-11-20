import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const complaints = await prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(complaints)
  } catch (error: any) {
    console.error('Get complaints error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const requiredFields = ['name', 'type', 'title', 'description', 'date']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    const complaint = await prisma.complaint.create({
      data: {
        name: data.name,
        email: data.email,
        type: data.type,
        title: data.title,
        description: data.description,
        status: data.status || 'pending',
        date: data.date,
        serviceProvider: data.serviceProvider,
        desiredResolution: data.desiredResolution,
        contactPreference: data.contactPreference,
        urgencyLevel: data.urgencyLevel,
        serviceDate: data.serviceDate,
        isAnonymous: data.anonymous || false,
        followUpEnabled: data.followUp !== false,
      },
    })

    return NextResponse.json(
      {
        message: 'Complaint created',
        complaint,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create complaint error:', error)
    return NextResponse.json(
      { error: 'Failed to create complaint' },
      { status: 500 }
    )
  }
}

