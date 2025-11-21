'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const serviceDetails: Record<string, {
  title: string
  description: string
  sections: Array<{
    title: string
    items: string[]
  }>
}> = {
  'Standard Apartment Cleaning': {
    title: 'Bedroom Apartment Standard Cleaning Package',
    description: 'Comprehensive standard cleaning for your apartment',
    sections: [
      {
        title: 'Kitchen Cleaning',
        items: [
          'Clean and sanitize the welcome mat',
          'Clean outside of the fridge',
          'Wash and dry dishes (if any)',
          'Clean all external surfaces of appliances',
          'Clean outside of drawers and cupboards',
          'Clean the inside and outside of the microwave',
          'Scrub and sanitize the sink',
          'Clean and polish countertops',
          'Empty trash and replace the liner',
          'Sweep the floors',
          'Mop the floors',
        ],
      },
      {
        title: 'Living/Dining Room Cleaning',
        items: [
          'Dust and wipe electronics and entertainment units',
          'Dust & wipe furniture (e.g., tables, shelves, chairs)',
          'Wipe down dining table and chairs',
          'Dust the couch and carpets',
          'Sweep and mop the floors',
        ],
      },
      {
        title: 'Bathroom/Toilet Basic Cleaning',
        items: [
          'Clean and organize bathroom cabinets',
          'Wipe and shine mirrors',
          'Clean the shower',
          'Thoroughly clean the toilet inside and out, including the base',
          'Mop the floors',
          'Empty trash and replace the liner',
        ],
      },
      {
        title: 'Bedroom Cleaning',
        items: [
          'Remove and change bed linens (on request only)',
          'Wipe bedside tables (pedestals)',
          'Dust the headboard and any hanging decorations',
          'Polish or treat wood furniture (e.g., dressers, nightstands)',
          'Sweep and mop the floors',
        ],
      },
      {
        title: 'Balcony Cleaning',
        items: [
          'Clean and rearrange the patio set',
          'Sweep and mop the floor',
        ],
      },
    ],
  },
  'Apartment Spring Cleaning': {
    title: 'Bedroom Apartment Spring Cleaning Package',
    description: 'Deep spring cleaning to refresh your apartment',
    sections: [
      {
        title: 'Kitchen Cleaning',
        items: [
          'Clean and sanitize the welcome mat',
          'Clean and organize both inside and outside of the fridge',
          'Wash and dry dishes (if any)',
          'Clean all interior and exterior surfaces of appliances (e.g., stove, toaster, blender, washing machine)',
          'Clean and organize inside and outside of drawers and cupboards',
          'Clean the inside and outside of the microwave',
          'Scrub and sanitize the sink',
          'Clean and polish countertops',
          'Empty trash and replace the liner',
          'Vacuum or sweep the floors',
          'Mop the floors',
        ],
      },
      {
        title: 'Living/Dining Room Cleaning',
        items: [
          'Dust and wipe electronics and entertainment units',
          'Polish or treat wood furniture (e.g., tables, shelves, chairs)',
          'Wipe down dining table and chairs',
          'Dust the couch and carpets',
          'Sweep and mop the floors',
        ],
      },
      {
        title: 'Bathroom/Toilet Deep Cleaning',
        items: [
          'Clean and organize bathroom cabinets',
          'Wipe and shine mirrors',
          'Deep clean the shower, steaming walls, tiles, and glass',
          'Organize and clean out drawers',
          'Thoroughly clean the toilet inside and out, including the base',
          'Mop the floors',
          'Empty trash and replace the liner',
        ],
      },
      {
        title: 'Bedroom Cleaning',
        items: [
          'Remove and change bed linens',
          'Wipe and organize bedside tables (pedestals)',
          'Dust the headboard and any hanging decorations',
          'Polish or treat wood furniture (e.g., dressers, nightstands)',
          'Clean and organize inside cupboards and clothes storage',
          'Sweep and mop the floors',
        ],
      },
      {
        title: 'Balcony Cleaning',
        items: [
          'Clean and rearrange the patio set',
          'Clean all surfaces around the balcony (railings, walls, etc.)',
          'Sweep and mop the floor',
        ],
      },
    ],
  },
  'Apartment Deep Cleaning': {
    title: 'Apartment Deep Cleaning',
    description: 'Comprehensive deep cleaning for your entire apartment',
    sections: [
      {
        title: 'Kitchen Cupboards Deep Cleaning & Organization',
        items: [
          'Remove all items, thoroughly clean cupboards inside and out, and neatly rearrange items back into the cupboards',
        ],
      },
      {
        title: 'Glass Doors, Mirrors, & Windows',
        items: [
          'Deep clean all glass doors, mirrors, and windows (both inside and outside)',
        ],
      },
      {
        title: 'Bathtub & Shower Cleaning',
        items: [
          'Steam and scrub bathtubs or showers',
        ],
      },
      {
        title: 'Bedroom Wardrobe Cleaning & Organization',
        items: [
          'Empty wardrobes in the bedroom(s), wipe inside and outside, fold clothes, and reorganize them back into the wardrobe(s)',
        ],
      },
      {
        title: 'Wall Cleaning',
        items: [
          'Wipe all walls in both bedroom(s), the lounge, and the kitchen',
        ],
      },
      {
        title: 'Appliance Cleaning',
        items: [
          'Move and deep clean all appliances, including the fridge, dishwasher, washing machine, dryer, and microwave',
        ],
      },
      {
        title: 'Oven Cleaning',
        items: [
          'Deep clean the oven interior and thoroughly wipe around the stove',
        ],
      },
      {
        title: 'Fridge Cleaning',
        items: [
          'Clean the fridge interior, organize items back inside, and wipe the exterior',
        ],
      },
      {
        title: 'Carpet & Rug Cleaning',
        items: [
          'Deep clean up to three carpets (lounge and both bedroom carpets). Please let us know if your bedrooms have fitted carpets',
        ],
      },
      {
        title: 'Couch Cleaning',
        items: [
          "Deep clean the couch. Please specify whether it's leather or fabric",
        ],
      },
      {
        title: 'Mattress Cleaning',
        items: [
          'Deep clean two bed mattresses',
        ],
      },
      {
        title: 'Changing & Ironing Bed Sheets',
        items: [
          'Iron and change bedsheets for both bedrooms',
        ],
      },
      {
        title: 'Skirting Board Cleaning',
        items: [
          'Wipe all skirting boards throughout the apartment',
        ],
      },
      {
        title: 'Balcony Cleaning',
        items: [
          'Clean balcony walls, patio furniture, skirting boards, and mop the floor',
        ],
      },
    ],
  },
  'Empty Apartment Deep Cleaning': {
    title: 'Empty Apartment Deep Cleaning',
    description: 'Comprehensive deep cleaning for empty apartments',
    sections: [
      {
        title: 'Complete Deep Cleaning',
        items: [
          'Deep cleaning all the kitchen cupboards',
          'Deep cleaning all the glass doors, mirror & windows',
          'Deep cleaning bathtub/shower',
          'Deep cleaning the bedroom cupboards',
          'Deep cleaning the walls',
          'Move & deep cleaning all the appliances',
          'Deep cleaning the oven',
          'Skirting',
          'Balcony',
        ],
      },
    ],
  },
  'House Spring Cleaning': {
    title: 'House Spring Cleaning',
    description: 'Comprehensive spring cleaning for your entire house',
    sections: [
      {
        title: 'Complete House Spring Cleaning',
        items: [
          'Deep cleaning all the kitchen cupboards & organizing',
          'Deep cleaning all the glass doors, mirrors & windows',
          'Deep cleaning bathtub/steaming shower',
          'Deep cleaning bedroom cupboards & organizing wardrobe',
          'Deep cleaning the walls',
          'Move & deep cleaning all the appliances',
          'Deep cleaning the oven',
          'Deep cleaning the fridge',
          'Deep cleaning the carpet rug',
          'Deep cleaning the couch',
          'Deep cleaning bed mattress',
          'Changing & ironing bed sheets',
          'Skirting',
          'Balcony/Patio',
          'Garage',
        ],
      },
    ],
  },
  'House Deep Cleaning': {
    title: 'House Deep Cleaning',
    description: 'Comprehensive deep cleaning for your entire house',
    sections: [
      {
        title: 'Complete House Deep Cleaning',
        items: [
          'Deep cleaning all the kitchen cupboards & organizing',
          'Deep cleaning all the glass doors, mirrors & windows',
          'Deep cleaning bathtub/steaming shower',
          'Deep cleaning bedroom cupboards & organizing wardrobe',
          'Deep cleaning the walls',
          'Move & deep cleaning all the appliances',
          'Deep cleaning the oven',
          'Deep cleaning the fridge',
          'Deep cleaning the carpet rug',
          'Deep cleaning the couch',
          'Deep cleaning bed mattress',
          'Changing & ironing bed sheets',
          'Skirting',
          'Balcony/Patio',
          'Garage',
        ],
      },
    ],
  },
  'Empty House Deep Cleaning': {
    title: 'Empty House Deep Cleaning',
    description: 'Comprehensive deep cleaning for empty houses',
    sections: [
      {
        title: 'Complete Empty House Deep Cleaning',
        items: [
          'Deep cleaning all the kitchen cupboards',
          'Deep cleaning all the glass doors, mirror & windows',
          'Deep cleaning bathtub/shower',
          'Deep cleaning the bedroom cupboards',
          'Deep cleaning the walls',
          'Deep cleaning the oven',
          'Skirting',
          'Balcony/Patio',
          'Garages',
        ],
      },
    ],
  },
}

export default function ServiceDetailsPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category') || 'Standard Apartment Cleaning'
  const details = serviceDetails[category] || serviceDetails['Standard Apartment Cleaning']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white py-12 px-4 shadow-2xl">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/services/cleaning"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 font-semibold transition-colors"
          >
            ← Back to Services
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{details.title}</h1>
          <p className="text-xl text-blue-100">{details.description}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="space-y-8">
            {details.sections.map((section, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </span>
                  {section.title}
                </h2>
                <ul className="space-y-3 ml-14">
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <span className="text-green-600 font-bold mt-1 flex-shrink-0">✓</span>
                      <span className="text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Book?</h3>
              <p className="text-gray-600 mb-6">
                Get started by selecting this service and booking your preferred date
              </p>
              <Link
                href={`/book-service?category=${encodeURIComponent(category)}`}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span>🚀</span>
                <span>Book This Service Now</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

