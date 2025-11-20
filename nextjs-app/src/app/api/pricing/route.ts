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

      return NextResponse.json(pricing)
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

