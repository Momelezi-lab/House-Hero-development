import Link from 'next/link'
import Image from 'next/image'

const services = [
  {
    title: 'Cleaning Services',
    description: 'Professional deep cleaning for your home',
    href: '/services/cleaning',
    icon: '🧹',
    available: true,
  },
  {
    title: 'Plumbing',
    description: 'Expert plumbing repairs and installations',
    href: '/book-plumbing',
    icon: '🔧',
    available: false,
  },
  {
    title: 'Electrical',
    description: 'Licensed electricians for all your needs',
    href: '/book-electrical',
    icon: '⚡',
    available: false,
  },
  {
    title: 'Pest Control',
    description: 'Effective pest elimination solutions',
    href: '/book-pestcontrol',
    icon: '🐛',
    available: false,
  },
  {
    title: 'Gardening',
    description: 'Landscaping and garden maintenance',
    href: '/book-gardening',
    icon: '🌳',
    available: false,
  },
  {
    title: 'Handyman',
    description: 'General repairs and home fixes',
    href: '/book-handyman',
    icon: '🛠️',
    available: false,
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Hero Section with Blurred Background */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Blur */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px)',
            transform: 'scale(1.1)', // Slight scale to hide blur edges
          }}
        />
        
        {/* Primary Blue Overlay with Gradient - Reduced opacity */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#2563EB]/60 via-[#2563EB]/55 to-[#1E40AF]/65" />
        
        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 py-20 text-center">
          {/* Logo/Brand */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-block mb-6 animate-bounce">
              <Image
                src="/Homeswift logo.png"
                alt="HomeSwift Logo"
                width={150}
                height={150}
                className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full object-cover mx-auto drop-shadow-2xl border-3 border-white/30"
                priority
              />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight animate-fade-in" style={{ animationDelay: '100ms' }}>
            Swift Services,
            <br />
            <span className="text-[#EFF6FF]">Reliable Results</span>
          </h1>

          {/* Sub-heading */}
          <p className="text-lg md:text-xl lg:text-2xl text-white/95 mb-4 font-medium max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
            Professional home services at your fingertips. Book trusted professionals for any task, delivered swiftly.
          </p>

          {/* CTA Button */}
          <div className="mt-12 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link
              href="/book-service"
              className="inline-flex items-center gap-3 bg-white text-[#2563EB] px-10 py-5 rounded-xl font-bold text-lg md:text-xl shadow-2xl hover:bg-[#2563EB] hover:text-white transform hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-white/20"
            >
              <span>Request a Service</span>
              <span className="text-2xl">→</span>
            </Link>
          </div>

          {/* Secondary CTA */}
          <div className="mt-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Link
              href="/services/cleaning"
              className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-lg transition-colors"
            >
              <span>Learn More</span>
              <span>↓</span>
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-20" />
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-20 -mt-16 relative z-30">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#111827] mb-4">
            Our Services
          </h2>
          <p className="text-center text-[#6B7280] mb-12 text-lg max-w-2xl mx-auto">
            Choose from our range of professional home services
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <ServiceCard key={service.title} service={service} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-white to-[#F3F4F6] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#111827] mb-4">
            Why Choose HomeSwift?
          </h2>
          <p className="text-center text-[#6B7280] mb-12 text-lg max-w-2xl mx-auto">
            Experience the difference with our trusted service platform
          </p>
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
        <div className="group relative p-8 rounded-xl bg-[#F3F4F6] border border-[#D1D5DB] opacity-75 cursor-not-allowed transform transition-all duration-300">
        <div className="absolute top-4 right-4 bg-[#6B7280] text-white text-xs font-bold px-3 py-1 rounded-full">
          Coming Soon
        </div>
        <div className="text-5xl mb-4">{service.icon}</div>
        <h3 className="text-2xl font-bold text-[#111827] mb-3">{service.title}</h3>
        <p className="text-[#6B7280]">{service.description}</p>
      </div>
    )
  }

  return (
    <Link
      href={service.href}
      className="group relative p-8 rounded-xl bg-white border border-[#D1D5DB] hover:border-[#2563EB] shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Content */}
      <div className="relative z-10">
        <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {service.icon}
        </div>
        <h3 className="text-2xl font-bold text-[#111827] mb-3 group-hover:text-[#2563EB] transition-colors">
          {service.title}
        </h3>
        <p className="text-[#6B7280] mb-4">{service.description}</p>
        <div className="flex items-center text-[#2563EB] font-semibold group-hover:translate-x-2 transition-transform">
          <span>Book Now</span>
          <span className="ml-2">→</span>
        </div>
      </div>
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
    <div className="text-center p-8 rounded-xl bg-white border border-[#D1D5DB] hover:border-[#2563EB] hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      <div className="text-5xl mb-4 transform hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-2xl font-bold text-[#111827] mb-3">{title}</h3>
      <p className="text-[#6B7280] leading-relaxed">{description}</p>
    </div>
  )
}

