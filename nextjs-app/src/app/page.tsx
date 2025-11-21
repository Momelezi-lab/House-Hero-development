import Link from 'next/link'

const services = [
  {
    title: 'Cleaning Services',
    description: 'Professional deep cleaning for your home',
    href: '/services/cleaning',
    icon: '🧹',
    available: true,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Plumbing',
    description: 'Expert plumbing repairs and installations',
    href: '/book-plumbing',
    icon: '🔧',
    available: false,
    gradient: 'from-gray-400 to-gray-500',
  },
  {
    title: 'Electrical',
    description: 'Licensed electricians for all your needs',
    href: '/book-electrical',
    icon: '⚡',
    available: false,
    gradient: 'from-gray-400 to-gray-500',
  },
  {
    title: 'Pest Control',
    description: 'Effective pest elimination solutions',
    href: '/book-pestcontrol',
    icon: '🐛',
    available: false,
    gradient: 'from-gray-400 to-gray-500',
  },
  {
    title: 'Gardening',
    description: 'Landscaping and garden maintenance',
    href: '/book-gardening',
    icon: '🌳',
    available: false,
    gradient: 'from-gray-400 to-gray-500',
  },
  {
    title: 'Handyman',
    description: 'General repairs and home fixes',
    href: '/book-handyman',
    icon: '🛠️',
    available: false,
    gradient: 'from-gray-400 to-gray-500',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-6">
              <span className="text-6xl animate-bounce">🏠</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-6">
              Welcome to HomeSwift
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-medium">
              Professional Home Services at Your Doorstep
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Book trusted professionals for all your home service needs. Fast, reliable, and affordable.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="text-center mb-16 space-x-4">
            <Link
              href="/services/cleaning"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 hover:from-blue-700 hover:to-cyan-700"
            >
              <span>ℹ️</span>
              <span>Learn More</span>
            </Link>
            <Link
              href="/book-service"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 hover:from-green-700 hover:to-emerald-700"
            >
              <span>🚀</span>
              <span>Book Now</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 pb-20">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white/80 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FeatureCard
              icon="⚡"
              title="Fast Service"
              description="Book and get service within 24 hours"
            />
            <FeatureCard
              icon="✅"
              title="Verified Professionals"
              description="All service providers are background checked"
            />
            <FeatureCard
              icon="💰"
              title="Transparent Pricing"
              description="No hidden fees, see prices upfront"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[0]
  index: number
}) {
  if (!service.available) {
    return (
      <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 opacity-75 cursor-not-allowed transform transition-all duration-300">
        <div className="absolute top-4 right-4 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Coming Soon
        </div>
        <div className="text-5xl mb-4">{service.icon}</div>
        <h3 className="text-2xl font-bold text-gray-700 mb-3">{service.title}</h3>
        <p className="text-gray-600">{service.description}</p>
      </div>
    )
  }

  return (
    <Link
      href={service.href}
      className="group relative p-8 rounded-2xl bg-white border-2 border-blue-200 hover:border-blue-400 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {service.icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {service.title}
        </h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
          <span>Book Now</span>
          <span className="ml-2">→</span>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </Link>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

