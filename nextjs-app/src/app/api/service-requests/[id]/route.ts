import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateEmailTemplates } from '@/lib/email'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { requestId: id },
      include: {
        customer: true,
        provider: true,
      },
    })

    if (!serviceRequest) {
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(serviceRequest)
  } catch (error: any) {
    console.error('Get service request error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service request' },
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
      'priority',
      'assignedProviderId',
      'providerName',
      'providerPhone',
      'providerEmail',
      'paymentMethod',
      'customerPaymentReceived',
      'providerPaymentMade',
      'commissionCollected',
      'adminNotes',
    ]

    const updateData: any = {}
    for (const field of updateableFields) {
      if (data[field] !== undefined) {
        const dbField = field
          .replace(/([A-Z])/g, '_$1')
          .toLowerCase()
          .replace(/^_/, '')
        updateData[dbField] = data[field]
      }
    }

    // Handle status changes
    if (data.status === 'confirmed' && !data.confirmedAt) {
      updateData.confirmedAt = new Date()
      // Send provider assignment emails
      const request = await prisma.serviceRequest.findUnique({
        where: { requestId: id },
      })
      if (request?.assignedProviderId) {
        const provider = await prisma.serviceProvider.findUnique({
          where: { id: request.assignedProviderId },
        })
        if (provider) {
          const templates = generateEmailTemplates()
          const providerEmail = templates.providerAssignment({
            providerName: provider.name,
            requestId: id,
            customerName: request.customerName,
            customerAddress: request.customerAddress,
            preferredDate: request.preferredDate.toISOString().split('T')[0],
            preferredTime: request.preferredTime,
          })
          await sendEmail({
            to: provider.email,
            subject: providerEmail.subject,
            html: providerEmail.html,
          })

          const customerEmail = templates.customerProviderDetails({
            customerName: request.customerName,
            providerName: provider.name,
            providerPhone: provider.phone,
            providerEmail: provider.email,
            requestId: id,
          })
          await sendEmail({
            to: request.customerEmail,
            subject: customerEmail.subject,
            html: customerEmail.html,
          })
        }
      }
    } else if (data.status === 'completed') {
      updateData.completedAt = new Date()
      const request = await prisma.serviceRequest.findUnique({
        where: { requestId: id },
      })
      if (request) {
        const templates = generateEmailTemplates()
        const completionEmail = templates.serviceCompletion({
          customerName: request.customerName,
          requestId: id,
        })
        await sendEmail({
          to: request.customerEmail,
          subject: completionEmail.subject,
          html: completionEmail.html,
        })
      }
    }

    const updated = await prisma.serviceRequest.update({
      where: { requestId: id },
      data: updateData,
      include: {
        customer: true,
        provider: true,
      },
    })

    return NextResponse.json({
      message: 'Service request updated',
      request: updated,
    })
  } catch (error: any) {
    console.error('Update service request error:', error)
    return NextResponse.json(
      { error: 'Failed to update service request' },
      { status: 500 }
    )
  }
}

