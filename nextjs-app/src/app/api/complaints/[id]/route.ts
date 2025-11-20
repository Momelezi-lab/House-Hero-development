import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const complaint = await prisma.complaint.findUnique({
      where: { id },
    })

    if (!complaint) {
      return NextResponse.json(
        { error: 'Complaint not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(complaint)
  } catch (error: any) {
    console.error('Get complaint error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch complaint' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()

    const updateableFields = [
      'status',
      'serviceProvider',
      'desiredResolution',
      'contactPreference',
      'urgencyLevel',
      'serviceDate',
      'isAnonymous',
      'followUpEnabled',
      'title',
      'description',
      'type',
    ]

    const updateData: any = {}
    for (const field of updateableFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field]
      }
    }

    const updated = await prisma.complaint.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      message: 'Complaint updated',
      complaint: updated,
    })
  } catch (error: any) {
    console.error('Update complaint error:', error)
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await prisma.complaint.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Complaint deleted' })
  } catch (error: any) {
    console.error('Delete complaint error:', error)
    return NextResponse.json(
      { error: 'Failed to delete complaint' },
      { status: 500 }
    )
  }
}

