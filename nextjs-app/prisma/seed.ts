import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to calculate provider base price (10% commission)
// providerBasePrice = customerDisplayPrice * 0.9
const calcProviderPrice = (customerPrice: number) => Math.round(customerPrice * 0.9)

const pricingData = [
  // Couch Deep Cleaning (+10% commission)
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '1 Seater Couch', itemDescription: '1 Seater Couch', providerBasePrice: calcProviderPrice(220), customerDisplayPrice: 220, colorSurchargeProvider: calcProviderPrice(220), colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '2 Seater Couch', itemDescription: '2 Seater Couch', providerBasePrice: calcProviderPrice(440), customerDisplayPrice: 440, colorSurchargeProvider: calcProviderPrice(220), colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '3 Seater Couch', itemDescription: '3 Seater Couch', providerBasePrice: calcProviderPrice(550), customerDisplayPrice: 550, colorSurchargeProvider: calcProviderPrice(220), colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '4 Seater Couch', itemDescription: '4 Seater Couch', providerBasePrice: calcProviderPrice(660), customerDisplayPrice: 660, colorSurchargeProvider: calcProviderPrice(220), colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '5 Seater Couch', itemDescription: '5 Seater Couch', providerBasePrice: calcProviderPrice(770), customerDisplayPrice: 770, colorSurchargeProvider: calcProviderPrice(220), colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '6 Seater Couch', itemDescription: '6 Seater Couch', providerBasePrice: calcProviderPrice(880), customerDisplayPrice: 880, colorSurchargeProvider: calcProviderPrice(220), colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '3 Seater L Couch', itemDescription: '3 Seater L Couch', providerBasePrice: calcProviderPrice(660), customerDisplayPrice: 660, colorSurchargeProvider: calcProviderPrice(220), colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '4 Seater L Couch', itemDescription: '4 Seater L Couch', providerBasePrice: calcProviderPrice(770), customerDisplayPrice: 770, colorSurchargeProvider: calcProviderPrice(220), colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '5 Seater L Couch', itemDescription: '5 Seater L Couch', providerBasePrice: calcProviderPrice(880), customerDisplayPrice: 880, colorSurchargeProvider: calcProviderPrice(220), colorSurchargeCustomer: 220, isWhiteApplicable: true },
  { serviceCategory: 'Couch Deep Cleaning', serviceType: '6 Seater L Couch', itemDescription: '6 Seater L Couch', providerBasePrice: calcProviderPrice(990), customerDisplayPrice: 990, colorSurchargeProvider: calcProviderPrice(220), colorSurchargeCustomer: 220, isWhiteApplicable: true },
  // Carpet Deep Cleaning
  { serviceCategory: 'Carpet Deep Cleaning', serviceType: 'Extra-Small', itemDescription: 'Extra-Small', providerBasePrice: calcProviderPrice(275), customerDisplayPrice: 275, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Carpet Deep Cleaning', serviceType: 'Small', itemDescription: 'Small', providerBasePrice: calcProviderPrice(330), customerDisplayPrice: 330, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Carpet Deep Cleaning', serviceType: 'Medium', itemDescription: 'Medium', providerBasePrice: calcProviderPrice(385), customerDisplayPrice: 385, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Carpet Deep Cleaning', serviceType: 'Large', itemDescription: 'Large', providerBasePrice: calcProviderPrice(440), customerDisplayPrice: 440, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Carpet Deep Cleaning', serviceType: 'X-Large', itemDescription: 'X-Large', providerBasePrice: calcProviderPrice(495), customerDisplayPrice: 495, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Fitted Carpet Deep Cleaning
  { serviceCategory: 'Fitted Carpet Deep Cleaning', serviceType: 'Standard Room', itemDescription: 'Standard Room', providerBasePrice: calcProviderPrice(495), customerDisplayPrice: 495, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Fitted Carpet Deep Cleaning', serviceType: 'Master Bedroom', itemDescription: 'Master Bedroom', providerBasePrice: calcProviderPrice(660), customerDisplayPrice: 660, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Mattress Deep Cleaning
  { serviceCategory: 'Mattress Deep Cleaning', serviceType: 'Single', itemDescription: 'Single', providerBasePrice: calcProviderPrice(385), customerDisplayPrice: 385, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Mattress Deep Cleaning', serviceType: 'Double', itemDescription: 'Double', providerBasePrice: calcProviderPrice(495), customerDisplayPrice: 495, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Mattress Deep Cleaning', serviceType: 'Queen', itemDescription: 'Queen', providerBasePrice: calcProviderPrice(550), customerDisplayPrice: 550, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Mattress Deep Cleaning', serviceType: 'King', itemDescription: 'King', providerBasePrice: calcProviderPrice(605), customerDisplayPrice: 605, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Headboard Deep Cleaning
  { serviceCategory: 'Headboard Deep Cleaning', serviceType: 'Single', itemDescription: 'Single Headboard', providerBasePrice: calcProviderPrice(220), customerDisplayPrice: 220, colorSurchargeProvider: calcProviderPrice(110), colorSurchargeCustomer: 110, isWhiteApplicable: true },
  { serviceCategory: 'Headboard Deep Cleaning', serviceType: 'Double', itemDescription: 'Double Headboard', providerBasePrice: calcProviderPrice(275), customerDisplayPrice: 275, colorSurchargeProvider: calcProviderPrice(110), colorSurchargeCustomer: 110, isWhiteApplicable: true },
  { serviceCategory: 'Headboard Deep Cleaning', serviceType: 'Queen', itemDescription: 'Queen Headboard', providerBasePrice: calcProviderPrice(330), customerDisplayPrice: 330, colorSurchargeProvider: calcProviderPrice(110), colorSurchargeCustomer: 110, isWhiteApplicable: true },
  { serviceCategory: 'Headboard Deep Cleaning', serviceType: 'King', itemDescription: 'King Headboard', providerBasePrice: calcProviderPrice(385), customerDisplayPrice: 385, colorSurchargeProvider: calcProviderPrice(110), colorSurchargeCustomer: 110, isWhiteApplicable: true },
  // Sleigh Bed Deep Cleaning
  { serviceCategory: 'Sleigh Bed Deep Cleaning', serviceType: 'Single', itemDescription: 'Single Sleigh Bed', providerBasePrice: calcProviderPrice(330), customerDisplayPrice: 330, colorSurchargeProvider: calcProviderPrice(165), colorSurchargeCustomer: 165, isWhiteApplicable: true },
  { serviceCategory: 'Sleigh Bed Deep Cleaning', serviceType: 'Double', itemDescription: 'Double Sleigh Bed', providerBasePrice: calcProviderPrice(385), customerDisplayPrice: 385, colorSurchargeProvider: calcProviderPrice(165), colorSurchargeCustomer: 165, isWhiteApplicable: true },
  { serviceCategory: 'Sleigh Bed Deep Cleaning', serviceType: 'Queen', itemDescription: 'Queen Sleigh Bed', providerBasePrice: calcProviderPrice(418), customerDisplayPrice: 418, colorSurchargeProvider: calcProviderPrice(165), colorSurchargeCustomer: 165, isWhiteApplicable: true },
  { serviceCategory: 'Sleigh Bed Deep Cleaning', serviceType: 'King', itemDescription: 'King Sleigh Bed', providerBasePrice: calcProviderPrice(440), customerDisplayPrice: 440, colorSurchargeProvider: calcProviderPrice(165), colorSurchargeCustomer: 165, isWhiteApplicable: true },
  // Standard Apartment Cleaning
  { serviceCategory: 'Standard Apartment Cleaning', serviceType: 'Bachelor Apartment', itemDescription: 'Bachelor', providerBasePrice: calcProviderPrice(330), customerDisplayPrice: 330, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Standard Apartment Cleaning', serviceType: '1 Bedroom Apartment', itemDescription: '1BR', providerBasePrice: calcProviderPrice(385), customerDisplayPrice: 385, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Standard Apartment Cleaning', serviceType: '2 Bedroom Apartment', itemDescription: '2BR', providerBasePrice: calcProviderPrice(440), customerDisplayPrice: 440, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Standard Apartment Cleaning', serviceType: '3 Bedroom Apartment', itemDescription: '3BR', providerBasePrice: calcProviderPrice(495), customerDisplayPrice: 495, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Apartment Spring Cleaning
  { serviceCategory: 'Apartment Spring Cleaning', serviceType: 'Bachelor Apartment', itemDescription: 'Bachelor Spring', providerBasePrice: calcProviderPrice(660), customerDisplayPrice: 660, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Apartment Spring Cleaning', serviceType: '1 Bedroom Apartment', itemDescription: '1BR Spring', providerBasePrice: calcProviderPrice(770), customerDisplayPrice: 770, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Apartment Spring Cleaning', serviceType: '2 Bedroom Apartment', itemDescription: '2BR Spring', providerBasePrice: calcProviderPrice(880), customerDisplayPrice: 880, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Apartment Spring Cleaning', serviceType: '3 Bedroom Apartment', itemDescription: '3BR Spring', providerBasePrice: calcProviderPrice(1100), customerDisplayPrice: 1100, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Apartment Deep Cleaning
  { serviceCategory: 'Apartment Deep Cleaning', serviceType: 'Bachelor Apartment', itemDescription: 'Empty/With Items - Bachelor', providerBasePrice: calcProviderPrice(1980), customerDisplayPrice: 1980, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Apartment Deep Cleaning', serviceType: '1 Bedroom Apartment', itemDescription: '1BR Deep', providerBasePrice: calcProviderPrice(2200), customerDisplayPrice: 2200, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Apartment Deep Cleaning', serviceType: '2 Bedroom Apartment', itemDescription: '2BR Deep', providerBasePrice: calcProviderPrice(2750), customerDisplayPrice: 2750, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Apartment Deep Cleaning', serviceType: '3 Bedroom Apartment', itemDescription: '3BR Deep', providerBasePrice: calcProviderPrice(3300), customerDisplayPrice: 3300, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Empty Apartment Deep Cleaning
  { serviceCategory: 'Empty Apartment Deep Cleaning', serviceType: 'Bachelor Apartment', itemDescription: 'Empty Bachelor', providerBasePrice: calcProviderPrice(1320), customerDisplayPrice: 1320, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Empty Apartment Deep Cleaning', serviceType: '1 Bedroom Apartment', itemDescription: 'Empty 1BR', providerBasePrice: calcProviderPrice(1430), customerDisplayPrice: 1430, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Empty Apartment Deep Cleaning', serviceType: '2 Bedroom Apartment', itemDescription: 'Empty 2BR', providerBasePrice: calcProviderPrice(1650), customerDisplayPrice: 1650, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Empty Apartment Deep Cleaning', serviceType: '3 Bedroom Apartment', itemDescription: 'Empty 3BR', providerBasePrice: calcProviderPrice(1980), customerDisplayPrice: 1980, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // House Spring Cleaning
  { serviceCategory: 'House Spring Cleaning', serviceType: '2 Bedroom House', itemDescription: '2BR Spring', providerBasePrice: calcProviderPrice(1980), customerDisplayPrice: 1980, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'House Spring Cleaning', serviceType: '3 Bedroom House', itemDescription: '3BR Spring', providerBasePrice: calcProviderPrice(2310), customerDisplayPrice: 2310, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'House Spring Cleaning', serviceType: '4 Bedroom House', itemDescription: '4BR Spring', providerBasePrice: calcProviderPrice(2750), customerDisplayPrice: 2750, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'House Spring Cleaning', serviceType: '5 Bedroom House', itemDescription: '5BR Spring', providerBasePrice: calcProviderPrice(3300), customerDisplayPrice: 3300, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // House Deep Cleaning
  { serviceCategory: 'House Deep Cleaning', serviceType: '2 Bedroom House', itemDescription: '2BR Deep', providerBasePrice: calcProviderPrice(3960), customerDisplayPrice: 3960, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'House Deep Cleaning', serviceType: '3 Bedroom House', itemDescription: '3BR Deep', providerBasePrice: calcProviderPrice(4950), customerDisplayPrice: 4950, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'House Deep Cleaning', serviceType: '4 Bedroom House', itemDescription: '4BR Deep', providerBasePrice: calcProviderPrice(5940), customerDisplayPrice: 5940, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'House Deep Cleaning', serviceType: '5 Bedroom House', itemDescription: '5BR Deep', providerBasePrice: calcProviderPrice(7150), customerDisplayPrice: 7150, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  // Empty House Deep Cleaning
  { serviceCategory: 'Empty House Deep Cleaning', serviceType: '2 Bedroom House', itemDescription: 'Empty 2BR', providerBasePrice: calcProviderPrice(2750), customerDisplayPrice: 2750, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Empty House Deep Cleaning', serviceType: '3 Bedroom House', itemDescription: 'Empty 3BR', providerBasePrice: calcProviderPrice(3850), customerDisplayPrice: 3850, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Empty House Deep Cleaning', serviceType: '4 Bedroom House', itemDescription: 'Empty 4BR', providerBasePrice: calcProviderPrice(4950), customerDisplayPrice: 4950, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
  { serviceCategory: 'Empty House Deep Cleaning', serviceType: '5 Bedroom House', itemDescription: 'Empty 5BR', providerBasePrice: calcProviderPrice(6050), customerDisplayPrice: 6050, colorSurchargeProvider: 0, colorSurchargeCustomer: 0, isWhiteApplicable: false },
]

async function main() {
  console.log('🌱 Seeding pricing data...')
  
  let count = 0
  for (const data of pricingData) {
    // Update existing or create new
    const existing = await prisma.servicePricing.findFirst({
      where: {
        serviceCategory: data.serviceCategory,
        serviceType: data.serviceType,
      },
    })

    if (existing) {
      await prisma.servicePricing.update({
        where: { id: existing.id },
        data: {
          ...data,
          commissionPercentage: 10,
        },
      })
      count++
    } else {
      await prisma.servicePricing.create({
        data: {
          ...data,
          commissionPercentage: 10,
        },
      })
      count++
    }
  }

  console.log(`✅ Updated/Created ${count} pricing records`)
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
