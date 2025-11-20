import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const provider = await prisma.serviceProvider.findUnique({
      where: { id },
    })

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(provider)
  } catch (error: any) {
    console.error('Get provider error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch provider' },
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
      'name',
      'serviceType',
      'phone',
      'email',
      'address',
      'experienceYears',
      'hourlyRate',
      'rating',
      'totalBookings',
      'status',
    ]

    const updateData: any = {}
    for (const field of updateableFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field]
      }
    }

    const updated = await prisma.serviceProvider.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      message: 'Provider updated',
      provider: updated,
    })
  } catch (error: any) {
    console.error('Update provider error:', error)
    return NextResponse.json(
      { error: 'Failed to update provider' },
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
    await prisma.serviceProvider.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Provider deleted' })
  } catch (error: any) {
    console.error('Delete provider error:', error)
    return NextResponse.json(
      { error: 'Failed to delete provider' },
      { status: 500 }
    )
  }
}

