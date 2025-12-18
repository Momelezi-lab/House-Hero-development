import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/service-requests/[id]/show-interest
 * Allows a provider to show interest in a booking
 * This does NOT auto-assign - it just adds provider to interestedProviders array
 * Admin must confirm the assignment
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    const { providerId } = data

    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      )
    }

    // Get the service request
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { requestId: id },
    })

    if (!serviceRequest) {
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      )
    }

    // Check if status allows interest (must be BROADCASTED or PENDING)
    if (serviceRequest.status !== 'broadcasted' && serviceRequest.status !== 'pending') {
      return NextResponse.json(
        { 
          error: `This booking is no longer accepting interest. Current status: ${serviceRequest.status}`,
          status: serviceRequest.status 
        },
        { status: 409 }
      )
    }

    // Check if already assigned
    if (serviceRequest.assignedProviderId) {
      return NextResponse.json(
        { 
          error: 'This booking has already been assigned to a provider',
          alreadyAssigned: true 
        },
        { status: 409 }
      )
    }

    // Get provider details
    const provider = await prisma.serviceProvider.findUnique({
      where: { id: providerId },
    })

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      )
    }

    // Parse existing interested providers
    let interestedProviders: any[] = []
    if (serviceRequest.interestedProviders) {
      try {
        interestedProviders = JSON.parse(serviceRequest.interestedProviders)
      } catch {
        interestedProviders = []
      }
    }

    // Check if provider already showed interest
    const alreadyInterested = interestedProviders.some(
      (p: any) => p.providerId === providerId
    )

    if (alreadyInterested) {
      return NextResponse.json(
        { 
          error: 'You have already shown interest in this booking',
          alreadyInterested: true 
        },
        { status: 409 }
      )
    }

    // Add provider to interested list
    interestedProviders.push({
      providerId: providerId,
      providerName: provider.name,
      providerEmail: provider.email,
      providerPhone: provider.phone,
      providerRating: provider.rating,
      acceptedAt: new Date().toISOString(),
    })

    // Determine new status
    // If first interest, change from PENDING to BROADCASTED, then to INTERESTED
    let newStatus = serviceRequest.status
    if (serviceRequest.status === 'pending') {
      newStatus = 'broadcasted'
    }
    if (interestedProviders.length > 0) {
      newStatus = 'interested'
    }

    // Update audit log
    let auditLog: any[] = []
    if (serviceRequest.auditLog) {
      try {
        auditLog = JSON.parse(serviceRequest.auditLog)
      } catch {
        auditLog = []
      }
    }

    auditLog.push({
      action: 'provider_interest',
      providerId: providerId,
      providerName: provider.name,
      timestamp: new Date().toISOString(),
      details: 'Provider showed interest in booking',
    })

    // Update the service request
    const updated = await prisma.serviceRequest.update({
      where: { requestId: id },
      data: {
        interestedProviders: JSON.stringify(interestedProviders),
        status: newStatus,
        auditLog: JSON.stringify(auditLog),
      },
      include: {
        customer: true,
        provider: true,
      },
    })

    return NextResponse.json({
      message: 'Interest submitted successfully. Awaiting admin confirmation.',
      request: updated,
      interestedProviders: interestedProviders.length,
    })
  } catch (error: any) {
    console.error('Show interest error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to show interest' },
      { status: 500 }
    )
  }
}

