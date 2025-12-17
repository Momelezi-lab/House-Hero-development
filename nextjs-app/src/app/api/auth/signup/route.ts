import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, businessName, email, password, phone, userType, serviceType, address, experienceYears } = data

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Check if it's a provider signup
    const isProvider = userType === 'provider' || !!serviceType

    // For providers, validate required fields
    if (isProvider && !serviceType) {
      return NextResponse.json(
        { error: 'Service type is required for service provider signup' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409, headers: corsHeaders }
      )
    }

    // Check if service provider exists with this email
    if (isProvider) {
      const existingProvider = await prisma.serviceProvider.findUnique({
        where: { email },
      })
      if (existingProvider) {
        return NextResponse.json(
          { error: 'Email already registered as a service provider' },
          { status: 409, headers: corsHeaders }
        )
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    const registeredDate = new Date().toISOString().split('T')[0]

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone,
        role: isProvider ? 'provider' : 'customer',
        registered: registeredDate,
      },
    })

    // If provider, also create ServiceProvider record
    let provider = null
    if (isProvider) {
      // Use business name if provided, otherwise use person's name
      const providerName = businessName || name
      provider = await prisma.serviceProvider.create({
        data: {
          name: providerName,
          email,
          phone: phone || '',
          serviceType,
          address: address || null,
          experienceYears: experienceYears ? parseInt(experienceYears) : 0,
          registered: registeredDate,
          status: 'active',
        },
      })
    }

    // Remove password hash from response
    const { passwordHash: _, ...userResponse } = user

    return NextResponse.json(
      {
        message: isProvider ? 'Service provider registered successfully' : 'User registered successfully',
        user: userResponse,
        provider: provider || undefined,
      },
      { status: 201, headers: corsHeaders }
    )
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to register user' },
      { status: 500, headers: corsHeaders }
    )
  }
}

