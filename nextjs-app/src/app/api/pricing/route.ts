import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')

    if (category) {
      // Get pricing for specific category
      const pricing = await prisma.servicePricing.findMany({
        where: {
          serviceCategory: category,
        },
        orderBy: {
          customerDisplayPrice: 'asc',
        },
      })

      console.log(`Found ${pricing.length} pricing items for category: ${category}`)
      
      // Return with consistent field names
      return NextResponse.json(pricing.map(item => ({
        id: item.id,
        serviceCategory: item.serviceCategory,
        serviceType: item.serviceType,
        itemDescription: item.itemDescription,
        providerBasePrice: item.providerBasePrice,
        customerDisplayPrice: item.customerDisplayPrice,
        colorSurchargeProvider: item.colorSurchargeProvider,
        colorSurchargeCustomer: item.colorSurchargeCustomer,
        isWhiteApplicable: item.isWhiteApplicable,
        commissionPercentage: item.commissionPercentage,
      })))
    }

    // Get all categories
    const categories = await prisma.servicePricing.findMany({
      select: {
        serviceCategory: true,
      },
      distinct: ['serviceCategory'],
      orderBy: {
        serviceCategory: 'asc',
      },
    })

    const categoryList = categories.map((c) => c.serviceCategory)
    return NextResponse.json(categoryList)
  } catch (error) {
    console.error('Pricing API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing data' },
      { status: 500 }
    )
  }
}

