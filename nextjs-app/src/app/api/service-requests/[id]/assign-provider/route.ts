import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateEmailTemplates } from '@/lib/email'

/**
 * POST /api/service-requests/[id]/assign-provider
 * Admin endpoint to assign a provider to a booking
 * This confirms the assignment and removes booking from other providers' dashboards
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()
    const { providerId, adminEmail } = data

    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      )
    }

    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Admin email is required for audit trail' },
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

    // Check if already assigned
    if (serviceRequest.assignedProviderId) {
      return NextResponse.json(
        { 
          error: 'This booking has already been assigned to a provider',
          alreadyAssigned: true,
          currentProviderId: serviceRequest.assignedProviderId
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

    // Parse interested providers to get all providers who showed interest
    let interestedProviders: any[] = []
    if (serviceRequest.interestedProviders) {
      try {
        interestedProviders = JSON.parse(serviceRequest.interestedProviders)
      } catch {
        interestedProviders = []
      }
    }

    // Get all provider IDs who showed interest (for notifications)
    const allInterestedProviderIds = interestedProviders.map((p: any) => p.providerId)

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
      action: 'provider_assigned',
      assignedBy: adminEmail,
      providerId: providerId,
      providerName: provider.name,
      timestamp: new Date().toISOString(),
      details: `Admin ${adminEmail} assigned provider ${provider.name} to booking`,
    })

    // Update the service request - assign provider and change status to ASSIGNED
    const updated = await prisma.serviceRequest.update({
      where: { requestId: id },
      data: {
        assignedProviderId: providerId,
        providerName: provider.name,
        providerPhone: provider.phone,
        providerEmail: provider.email,
        status: 'assigned',
        assignedAt: new Date(),
        assignedBy: adminEmail,
        auditLog: JSON.stringify(auditLog),
      },
      include: {
        customer: true,
        provider: true,
      },
    })

    // Send notifications
    try {
      const templates = generateEmailTemplates()

      // Email to assigned provider
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

      // Email to non-selected providers (if any)
      const nonSelectedProviders = interestedProviders.filter(
        (p: any) => p.providerId !== providerId
      )

      for (const nonSelected of nonSelectedProviders) {
        try {
          await sendEmail({
            to: nonSelected.providerEmail,
            subject: `Job Assignment Update - Request #${id}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563EB;">Job Assignment Update</h2>
                <p>Dear ${nonSelected.providerName},</p>
                <p>This job has been assigned to another provider.</p>
                <p><strong>Request ID:</strong> #${id}</p>
                <p>Thank you for your interest. We have other opportunities available.</p>
                <p>Best regards,<br><strong>HomeSwift Team</strong></p>
              </div>
            `,
          })
        } catch (emailError) {
          console.error(`Failed to send email to ${nonSelected.providerEmail}:`, emailError)
        }
      }
    } catch (emailError) {
      console.error('Error sending assignment emails:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: 'Provider assigned successfully',
      request: updated,
      notifiedProviders: allInterestedProviderIds.length,
    })
  } catch (error: any) {
    console.error('Assign provider error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to assign provider' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/service-requests/[id]/assign-provider
 * Admin endpoint to reject/remove a provider from interested list
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const searchParams = request.nextUrl.searchParams
    const providerId = searchParams.get('providerId')
    const adminEmail = searchParams.get('adminEmail')

    if (!providerId) {
      return NextResponse.json(
        { error: 'Provider ID is required' },
        { status: 400 }
      )
    }

    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Admin email is required for audit trail' },
        { status: 400 }
      )
    }

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { requestId: id },
    })

    if (!serviceRequest) {
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      )
    }

    // Parse interested providers
    let interestedProviders: any[] = []
    if (serviceRequest.interestedProviders) {
      try {
        interestedProviders = JSON.parse(serviceRequest.interestedProviders)
      } catch {
        interestedProviders = []
      }
    }

    // Remove provider from interested list
    const providerIdNum = parseInt(providerId)
    const beforeCount = interestedProviders.length
    interestedProviders = interestedProviders.filter(
      (p: any) => p.providerId !== providerIdNum
    )

    if (interestedProviders.length === beforeCount) {
      return NextResponse.json(
        { error: 'Provider not found in interested list' },
        { status: 404 }
      )
    }

    // Update status if no more interested providers
    let newStatus = serviceRequest.status
    if (interestedProviders.length === 0 && serviceRequest.status === 'interested') {
      newStatus = 'broadcasted'
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
      action: 'provider_rejected',
      rejectedBy: adminEmail,
      providerId: providerIdNum,
      timestamp: new Date().toISOString(),
      details: `Admin ${adminEmail} removed provider from interested list`,
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
      message: 'Provider removed from interested list',
      request: updated,
      remainingInterested: interestedProviders.length,
    })
  } catch (error: any) {
    console.error('Reject provider error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to reject provider' },
      { status: 500 }
    )
  }
}

