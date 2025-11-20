import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to House Hero
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional Home Services at Your Doorstep
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <ServiceCard
            title="Cleaning Services"
            description="Professional cleaning for your home"
            href="/book-service"
            available
          />
          <ServiceCard
            title="Plumbing"
            description="Expert plumbing services"
            href="/book-plumbing"
            available={false}
          />
          <ServiceCard
            title="Electrical"
            description="Licensed electricians"
            href="/book-electrical"
            available={false}
          />
          <ServiceCard
            title="Pest Control"
            description="Effective pest solutions"
            href="/book-pestcontrol"
            available={false}
          />
          <ServiceCard
            title="Gardening"
            description="Landscaping and maintenance"
            href="/book-gardening"
            available={false}
          />
          <ServiceCard
            title="Handyman"
            description="General repairs and fixes"
            href="/book-handyman"
            available={false}
          />
        </div>

        <div className="text-center mt-12">
          <Link
            href="/book-service"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Book Cleaning Service
          </Link>
        </div>
      </div>
    </main>
  )
}

function ServiceCard({
  title,
  description,
  href,
  available,
}: {
  title: string
  description: string
  href: string
  available: boolean
}) {
  return (
    <Link
      href={href}
      className={`block p-6 rounded-lg border-2 transition ${
        available
          ? 'border-blue-500 bg-white hover:shadow-lg cursor-pointer'
          : 'border-gray-300 bg-gray-100 opacity-60 cursor-not-allowed relative'
      }`}
    >
      {!available && (
        <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded">
          Coming Soon
        </span>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  )
}

