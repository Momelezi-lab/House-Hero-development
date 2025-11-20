import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, generateEmailTemplates } from '@/lib/email'
import { Decimal } from '@prisma/client/runtime/library'

const CALLOUT_FEE = 100.00 // R100 callout fee

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = [
      'customer_name',
      'customer_email',
      'customer_phone',
      'customer_address',
      'preferred_date',
      'preferred_time',
      'items',
    ]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate phone (10 digits for South Africa)
    const phone = data.customer_phone
      .replace(/\s+/g, '')
      .replace(/-/g, '')
      .replace('+27', '0')
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      return NextResponse.json(
        { error: 'Phone number must be exactly 10 digits' },
        { status: 400 }
      )
    }

    // Validate date (cannot be in the past)
    const preferredDate = new Date(data.preferred_date)
    if (preferredDate < new Date(new Date().setHours(0, 0, 0, 0))) {
      return NextResponse.json(
        { error: 'Preferred date cannot be in the past' },
        { status: 400 }
      )
    }

    // Calculate totals
    let totalCustomerPaid = new Decimal(0)
    let totalProviderPayout = new Decimal(0)
    let totalCommissionEarned = new Decimal(0)
    const selectedItemsArray: any[] = []

    // Process each item
    for (const itemInput of data.items) {
      const { category, type, quantity, is_white } = itemInput

      if (quantity < 1 || quantity > 10) {
        return NextResponse.json(
          { error: 'Quantity must be between 1 and 10' },
          { status: 400 }
        )
      }

      // Get pricing from database
      const pricing = await prisma.servicePricing.findFirst({
        where: {
          serviceCategory: category,
          serviceType: type,
        },
      })

      if (!pricing) {
        return NextResponse.json(
          { error: `Pricing not found for ${category} - ${type}` },
          { status: 404 }
        )
      }

      // Calculate prices
      let customerLinePrice = new Decimal(pricing.customerDisplayPrice.toString())
      let providerLinePrice = new Decimal(pricing.providerBasePrice.toString())

      if (is_white && pricing.isWhiteApplicable) {
        customerLinePrice = customerLinePrice.add(
          new Decimal(pricing.colorSurchargeCustomer.toString())
        )
        providerLinePrice = providerLinePrice.add(
          new Decimal(pricing.colorSurchargeProvider.toString())
        )
      }

      const itemPriceCustomer = customerLinePrice.mul(quantity)
      const itemPriceProvider = providerLinePrice.mul(quantity)
      const itemCommission = itemPriceCustomer.sub(itemPriceProvider)

      totalCustomerPaid = totalCustomerPaid.add(itemPriceCustomer)
      totalProviderPayout = totalProviderPayout.add(itemPriceProvider)
      totalCommissionEarned = totalCommissionEarned.add(itemCommission)

      selectedItemsArray.push({
        category: pricing.serviceCategory,
        type: pricing.serviceType,
        is_white,
        quantity,
        customer_price: parseFloat(itemPriceCustomer.toString()),
        provider_price: parseFloat(itemPriceProvider.toString()),
        commission: parseFloat(itemCommission.toString()),
      })
    }

    // Add callout fee
    totalCustomerPaid = totalCustomerPaid.add(CALLOUT_FEE)
    totalCommissionEarned = totalCommissionEarned.add(CALLOUT_FEE)

    // Create or find customer
    let customer = await prisma.customer.findFirst({
      where: { customerEmail: data.customer_email },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          customerName: data.customer_name,
          customerEmail: data.customer_email,
          customerPhone: phone,
        },
      })
    } else {
      await prisma.customer.update({
        where: { customerId: customer.customerId },
        data: { totalBookings: { increment: 1 } },
      })
    }

    // Parse time
    const [hours, minutes] = data.preferred_time.split(':')
    const preferredTime = `${hours}:${minutes}:00`

    // Create service request
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        customerId: customer.customerId,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: phone,
        customerAddress: data.customer_address,
        unitNumber: data.unit_number,
        complexName: data.complex_name,
        accessInstructions: data.access_instructions,
        preferredDate: preferredDate,
        preferredTime: preferredTime,
        additionalNotes: data.additional_notes,
        selectedItems: JSON.stringify(selectedItemsArray),
        totalCustomerPaid: totalCustomerPaid,
        totalProviderPayout: totalProviderPayout,
        totalCommissionEarned: totalCommissionEarned,
        status: 'pending',
      },
    })

    // Send emails
    const templates = generateEmailTemplates()
    const customerEmail = templates.customerConfirmation({
      customerName: data.customer_name,
      requestId: serviceRequest.requestId,
      totalAmount: parseFloat(totalCustomerPaid.toString()),
      preferredDate: data.preferred_date,
      preferredTime: data.preferred_time,
    })
    await sendEmail({
      to: data.customer_email,
      subject: customerEmail.subject,
      html: customerEmail.html,
    })

    const adminEmail = templates.adminAlert({
      requestId: serviceRequest.requestId,
      customerName: data.customer_name,
      totalAmount: parseFloat(totalCustomerPaid.toString()),
    })
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@homeswift.com',
      subject: adminEmail.subject,
      html: adminEmail.html,
    })

    return NextResponse.json(
      {
        message: 'Service request created successfully',
        request_id: serviceRequest.requestId,
        total_customer_paid: parseFloat(totalCustomerPaid.toString()),
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Service request creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create service request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {}
    if (status) where.status = status
    if (category) {
      where.selectedItems = { contains: category }
    }
    if (search) {
      where.OR = [
        { customerName: { contains: search } },
        { requestId: parseInt(search) || 0 },
      ]
    }

    const requests = await prisma.serviceRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        provider: true,
      },
    })

    return NextResponse.json(requests)
  } catch (error: any) {
    console.error('Get service requests error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service requests' },
      { status: 500 }
    )
  }
}

