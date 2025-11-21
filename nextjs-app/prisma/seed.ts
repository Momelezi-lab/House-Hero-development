import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const pricingData = [
  // Couch Deep Cleaning
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '1 Seater Couch', itemDescription: '1 Seater Couch', providerBasePrice: 200, customerDisplayPrice: 220, colorSurchargeProvider: 200, colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '2 Seater Couch', itemDescription: '2 Seater Couch', providerBasePrice: 400, customerDisplayPrice: 440, colorSurchargeProvider: 200, colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '3 Seater Couch', itemDescription: '3 Seater Couch', providerBasePrice: 500, customerDisplayPrice: 550, colorSurchargeProvider: 200, colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '4 Seater Couch', itemDescription: '4 Seater Couch', providerBasePrice: 600, customerDisplayPrice: 660, colorSurchargeProvider: 200, colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '5 Seater Couch', itemDescription: '5 Seater Couch', providerBasePrice: 700, customerDisplayPrice: 770, colorSurchargeProvider: 200, colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '6 Seater Couch', itemDescription: '6 Seater Couch', providerBasePrice: 800, customerDisplayPrice: 880, colorSurchargeProvider: 200, colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '3 Seater L Couch', itemDescription: '3 Seater L Couch', providerBasePrice: 600, customerDisplayPrice: 660, colorSurchargeProvider: 200, colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '4 Seater L Couch', itemDescription: '4 Seater L Couch', providerBasePrice: 700, customerDisplayPrice: 770, colorSurchargeProvider: 200, colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '5 Seater L Couch', itemDescription: '5 Seater L Couch', providerBasePrice: 800, customerDisplayPrice: 880, colorSurchargeProvider: 200, colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '6 Seater L Couch', itemDescription: '6 Seater L Couch', providerBasePrice: 900, customerDisplayPrice: 990, colorSurchargeProvider: 200, colorSurchargeCustomer: 220, isWhiteApplicable: true },
  // Carpet Deep Cleaning
  { serviceCategory: 'Carpet Deep Cleaning', serviceType: 'Extra-Small', itemDescription: 'Extra-Small', providerBasePrice: 250, customerDisplayPrice: 275, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Carpet Deep Cleaning', serviceType: 'Small', itemDescription: 'Small', providerBasePrice: 300, customerDisplayPrice: 330, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Carpet Deep Cleaning', serviceType: 'Medium', itemDescription: 'Medium', providerBasePrice: 350, customerDisplayPrice: 385, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Carpet Deep Cleaning', serviceType: 'Large', itemDescription: 'Large', providerBasePrice: 400, customerDisplayPrice: 440, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Carpet Deep Cleaning', serviceType: 'X-Large', itemDescription: 'X-Large', providerBasePrice: 450, customerDisplayPrice: 495, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Fitted Carpet Deep Cleaning
  { serviceCategory: 'Fitted Carpet Deep Cleaning', serviceType: 'Standard Room', itemDescription: 'Standard Room', providerBasePrice: 450, customerDisplayPrice: 495, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Fitted Carpet Deep Cleaning', serviceType: 'Master Bedroom', itemDescription: 'Master Bedroom', providerBasePrice: 600, customerDisplayPrice: 660, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Mattress Deep Cleaning
  { serviceCategory: 'Mattress Deep Cleaning', serviceType: 'Single', itemDescription: 'Single', providerBasePrice: 350, customerDisplayPrice: 385, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Mattress Deep Cleaning', serviceType: 'Double', itemDescription: 'Double', providerBasePrice: 450, customerDisplayPrice: 495, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Mattress Deep Cleaning', serviceType: 'Queen', itemDescription: 'Queen', providerBasePrice: 500, customerDisplayPrice: 550, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Mattress Deep Cleaning', serviceType: 'King', itemDescription: 'King', providerBasePrice: 600, customerDisplayPrice: 660, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Headboard Deep Cleaning
  { serviceCategory: 'Headboard Deep Cleaning', serviceType: 'Standard', itemDescription: 'Standard', providerBasePrice: 200, customerDisplayPrice: 220, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Headboard Deep Cleaning', serviceType: 'Large', itemDescription: 'Large', providerBasePrice: 300, customerDisplayPrice: 330, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Sleigh Bed Deep Cleaning
  { serviceCategory: 'Sleigh Bed Deep Cleaning', serviceType: 'Standard', itemDescription: 'Standard', providerBasePrice: 400, customerDisplayPrice: 440, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Sleigh Bed Deep Cleaning', serviceType: 'Large', itemDescription: 'Large', providerBasePrice: 500, customerDisplayPrice: 550, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Standard Apartment Cleaning
  { serviceCategory: 'Standard Apartment Cleaning', serviceType: 'Bachelor Apartment', itemDescription: 'Bachelor', providerBasePrice: 600, customerDisplayPrice: 660, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Standard Apartment Cleaning', serviceType: '1 Bedroom Apartment', itemDescription: '1BR', providerBasePrice: 800, customerDisplayPrice: 880, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Standard Apartment Cleaning', serviceType: '2 Bedroom Apartment', itemDescription: '2BR', providerBasePrice: 1000, customerDisplayPrice: 1100, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Standard Apartment Cleaning', serviceType: '3 Bedroom Apartment', itemDescription: '3BR', providerBasePrice: 1200, customerDisplayPrice: 1320, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Apartment Spring Cleaning
  { serviceCategory: 'Apartment Spring Cleaning', serviceType: 'Bachelor Apartment', itemDescription: 'Bachelor Spring', providerBasePrice: 700, customerDisplayPrice: 770, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Apartment Spring Cleaning', serviceType: '1 Bedroom Apartment', itemDescription: '1BR Spring', providerBasePrice: 900, customerDisplayPrice: 990, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Apartment Spring Cleaning', serviceType: '2 Bedroom Apartment', itemDescription: '2BR Spring', providerBasePrice: 1100, customerDisplayPrice: 1210, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Apartment Spring Cleaning', serviceType: '3 Bedroom Apartment', itemDescription: '3BR Spring', providerBasePrice: 1300, customerDisplayPrice: 1430, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Apartment Deep Cleaning
  { serviceCategory: 'Apartment Deep Cleaning', serviceType: 'Bachelor Apartment', itemDescription: 'Empty/With Items - Bachelor', providerBasePrice: 1800, customerDisplayPrice: 1980, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Apartment Deep Cleaning', serviceType: '1 Bedroom Apartment', itemDescription: '1BR Deep', providerBasePrice: 2000, customerDisplayPrice: 2200, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Apartment Deep Cleaning', serviceType: '2 Bedroom Apartment', itemDescription: '2BR Deep', providerBasePrice: 2500, customerDisplayPrice: 2750, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Apartment Deep Cleaning', serviceType: '3 Bedroom Apartment', itemDescription: '3BR Deep', providerBasePrice: 3000, customerDisplayPrice: 3300, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Empty Apartment Deep Cleaning
  { serviceCategory: 'Empty Apartment Deep Cleaning', serviceType: 'Bachelor Apartment', itemDescription: 'Empty Bachelor', providerBasePrice: 1200, customerDisplayPrice: 1320, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Empty Apartment Deep Cleaning', serviceType: '1 Bedroom Apartment', itemDescription: 'Empty 1BR', providerBasePrice: 1300, customerDisplayPrice: 1430, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Empty Apartment Deep Cleaning', serviceType: '2 Bedroom Apartment', itemDescription: 'Empty 2BR', providerBasePrice: 1500, customerDisplayPrice: 1650, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Empty Apartment Deep Cleaning', serviceType: '3 Bedroom Apartment', itemDescription: 'Empty 3BR', providerBasePrice: 1800, customerDisplayPrice: 1980, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // House Spring Cleaning
  { serviceCategory: 'House Spring Cleaning', serviceType: '2 Bedroom House', itemDescription: '2BR Spring', providerBasePrice: 1800, customerDisplayPrice: 1980, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'House Spring Cleaning', serviceType: '3 Bedroom House', itemDescription: '3BR Spring', providerBasePrice: 2100, customerDisplayPrice: 2310, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'House Spring Cleaning', serviceType: '4 Bedroom House', itemDescription: '4BR Spring', providerBasePrice: 2500, customerDisplayPrice: 2750, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'House Spring Cleaning', serviceType: '5 Bedroom House', itemDescription: '5BR Spring', providerBasePrice: 3000, customerDisplayPrice: 3300, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // House Deep Cleaning
  { serviceCategory: 'House Deep Cleaning', serviceType: '2 Bedroom House', itemDescription: '2BR Deep', providerBasePrice: 3600, customerDisplayPrice: 3960, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'House Deep Cleaning', serviceType: '3 Bedroom House', itemDescription: '3BR Deep', providerBasePrice: 4500, customerDisplayPrice: 4950, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'House Deep Cleaning', serviceType: '4 Bedroom House', itemDescription: '4BR Deep', providerBasePrice: 5400, customerDisplayPrice: 5940, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'House Deep Cleaning', serviceType: '5 Bedroom House', itemDescription: '5BR Deep', providerBasePrice: 6500, customerDisplayPrice: 7150, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Empty House Deep Cleaning
  { serviceCategory: 'Empty House Deep Cleaning', serviceType: '3 Bedroom House', itemDescription: 'Empty 3BR', providerBasePrice: 3500, customerDisplayPrice: 3850, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Empty House Deep Cleaning', serviceType: '4 Bedroom House', itemDescription: 'Empty 4BR', providerBasePrice: 4500, customerDisplayPrice: 4950, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Empty House Deep Cleaning', serviceType: '5 Bedroom House', itemDescription: 'Empty 5BR', providerBasePrice: 5500, customerDisplayPrice: 6050, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
]

async function main() {
  console.log('🌱 Seeding pricing data...')
  
  let count = 0
  for (const data of pricingData) {
    const existing = await prisma.servicePricing.findFirst({
      where: {
        serviceCategory: data.serviceCategory,
        serviceType: data.serviceType,
      },
    })

    if (!existing) {
      await prisma.servicePricing.create({
        data: {
          ...data,
          commissionPercentage: 10,
        },
      })
      count++
    }
  }

  console.log(`✅ Seeded ${count} pricing records`)
  console.log(`📊 Total pricing records: ${await prisma.servicePricing.count()}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

