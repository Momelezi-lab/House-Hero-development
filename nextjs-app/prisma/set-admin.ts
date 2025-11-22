import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setAdmin() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.error('Usage: tsx prisma/set-admin.ts <email> <password>')
    console.error('Example: tsx prisma/set-admin.ts admin@homeswift.com admin123')
    process.exit(1)
  }

  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      // Update existing user to admin
      const passwordHash = await bcrypt.hash(password, 10)
      user = await prisma.user.update({
        where: { email },
        data: {
          role: 'admin',
          passwordHash,
        },
      })
      console.log(`✅ User ${email} updated to admin role`)
    } else {
      // Create new admin user
      const passwordHash = await bcrypt.hash(password, 10)
      user = await prisma.user.create({
        data: {
          email,
          name: 'Admin User',
          passwordHash,
          role: 'admin',
          registered: new Date().toISOString().split('T')[0],
        },
      })
      console.log(`✅ Admin user ${email} created successfully`)
    }
  } catch (error) {
    console.error('Error setting admin:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setAdmin()

