import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateEmailTemplates } from '@/lib/email'

/**
 * POST /api/service-requests/[id]/accept
 * Allows a provider to accept a booking
 * This is an atomic operation - only one provider can accept a booking
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

    // Get the service request with a transaction to ensure atomicity
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { requestId: id },
      include: {
        provider: true,
        customer: true,
      },
    })

    if (!serviceRequest) {
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      )
    }

    // Check if already assigned to another provider
    if (serviceRequest.assignedProviderId && serviceRequest.assignedProviderId !== providerId) {
      return NextResponse.json(
        { 
          error: 'This booking has already been accepted by another provider',
          alreadyAssigned: true 
        },
        { status: 409 }
      )
    }

    // Check if already assigned to this provider
    if (serviceRequest.assignedProviderId === providerId) {
      return NextResponse.json(
        { 
          error: 'You have already accepted this booking',
          alreadyAssigned: true 
        },
        { status: 409 }
      )
    }

    // Check if status is still pending (can only accept pending bookings)
    if (serviceRequest.status !== 'pending') {
      return NextResponse.json(
        { 
          error: `This booking is no longer available. Current status: ${serviceRequest.status}`,
          status: serviceRequest.status 
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

    // Atomically update the service request
    // Use update with a condition to ensure it's still available
    const updated = await prisma.serviceRequest.updateMany({
      where: {
        requestId: id,
        status: 'pending',
        assignedProviderId: null, // Only update if not already assigned
      },
      data: {
        assignedProviderId: providerId,
        providerName: provider.name,
        providerPhone: provider.phone,
        providerEmail: provider.email,
        status: 'confirmed',
        confirmedAt: new Date(),
      },
    })

    // If no rows were updated, it means another provider accepted it first
    if (updated.count === 0) {
      // Re-check the current state
      const currentRequest = await prisma.serviceRequest.findUnique({
        where: { requestId: id },
      })

      if (currentRequest?.assignedProviderId) {
        return NextResponse.json(
          { 
            error: 'This booking was just accepted by another provider. Please refresh and try another booking.',
            alreadyAssigned: true 
          },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { 
          error: 'Unable to accept booking. It may have been updated. Please refresh and try again.',
        },
        { status: 409 }
      )
    }

    // Get the updated request with relations
    const updatedRequest = await prisma.serviceRequest.findUnique({
      where: { requestId: id },
      include: {
        customer: true,
        provider: true,
      },
    })

    // Send notification emails
    try {
      const templates = generateEmailTemplates()

      // Email to provider
      const providerEmail = templates.providerAssignment({
        providerName: provider.name,
        requestId: id,
        customerName: serviceRequest.customerName,
        customerAddress: serviceRequest.customerAddress,
        preferredDate: serviceRequest.preferredDate
          .toISOString()
          .split('T')[0],
        preferredTime: serviceRequest.preferredTime,
      })
      await sendEmail({
        to: provider.email,
        subject: providerEmail.subject,
        html: providerEmail.html,
      })

      // Email to customer
      const customerEmail = templates.customerProviderDetails({
        customerName: serviceRequest.customerName,
        providerName: provider.name,
        providerPhone: provider.phone,
        providerEmail: provider.email,
        requestId: id,
      })
      await sendEmail({
        to: serviceRequest.customerEmail,
        subject: customerEmail.subject,
        html: customerEmail.html,
      })
    } catch (emailError) {
      console.error('Error sending acceptance emails:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: 'Booking accepted successfully',
      request: updatedRequest,
    })
  } catch (error: any) {
    console.error('Accept booking error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to accept booking' },
      { status: 500 }
    )
  }
}

