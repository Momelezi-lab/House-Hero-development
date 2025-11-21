'use client'

import Link from 'next/link'

export default function CleaningServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white py-16 px-4 shadow-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 text-6xl animate-bounce">🧹</div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Professional Cleaning Services</h1>
          <p className="text-xl text-blue-100">Deep cleaning solutions for your home</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Service Overview */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Our Cleaning Services?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Team</h3>
              <p className="text-gray-600">Trained and experienced cleaners</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">Safe cleaning products for your family</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast & Efficient</h3>
              <p className="text-gray-600">Quick turnaround times</p>
            </div>
          </div>
        </section>

        {/* Service Types */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Cleaning Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ServiceTypeCard
              title="Deep Cleaning"
              description="Thorough cleaning of all surfaces, corners, and hard-to-reach areas"
              icon="🔍"
            />
            <ServiceTypeCard
              title="Spring Cleaning"
              description="Comprehensive seasonal cleaning to refresh your home"
              icon="🌸"
            />
            <ServiceTypeCard
              title="Couch Cleaning"
              description="Professional deep cleaning for all types of couches and upholstery"
              icon="🛋️"
            />
            <ServiceTypeCard
              title="Carpet Cleaning"
              description="Deep steam cleaning for carpets and rugs"
              icon="🧸"
            />
            <ServiceTypeCard
              title="Mattress Cleaning"
              description="Sanitize and refresh your mattresses"
              icon="🛏️"
            />
            <ServiceTypeCard
              title="Apartment Cleaning"
              description="Complete cleaning solutions for apartments of all sizes"
              icon="🏢"
            />
          </div>
        </section>

        {/* Process */}
        <section className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-8 mb-8 border border-blue-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="space-y-6">
            <ProcessStep number={1} title="Book Your Service" description="Select your cleaning service and preferred date/time" />
            <ProcessStep number={2} title="We Confirm" description="Our team confirms your booking within 2 hours" />
            <ProcessStep number={3} title="Service Day" description="Professional cleaners arrive at your scheduled time" />
            <ProcessStep number={4} title="Quality Check" description="We ensure everything meets our high standards" />
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/book-service"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-cyan-700"
          >
            <span>🚀</span>
            <span>Book Cleaning Service Now</span>
            <span>→</span>
          </Link>
        </div>
      </main>
    </div>
  )
}

function ServiceTypeCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: string
}) {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function ProcessStep({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  )
}

