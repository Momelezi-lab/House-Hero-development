import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * PATCH /api/users/[id]
 * Update a user
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const data = await request.json()

    // Only allow updating specific fields
    const updateableFields: any = {}
    if (data.name !== undefined) updateableFields.name = data.name
    if (data.email !== undefined) updateableFields.email = data.email
    if (data.phone !== undefined) updateableFields.phone = data.phone
    if (data.role !== undefined) updateableFields.role = data.role

    const user = await prisma.user.update({
      where: { id },
      data: updateableFields,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        registered: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ message: 'User updated', user })
  } catch (error: any) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/users/[id]
 * Delete a user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent deleting admin users
    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Cannot delete admin users' },
        { status: 403 }
      )
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'User deleted' })
  } catch (error: any) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}

