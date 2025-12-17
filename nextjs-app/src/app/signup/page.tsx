'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function SignupPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'customer' | 'provider'>('customer')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })
  const [providerFormData, setProviderFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    password: '',
    phone: '',
    serviceType: '',
    address: '',
    experienceYears: '',
  })
  const [error, setError] = useState('')

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user))
      // Trigger storage event to update navigation
      window.dispatchEvent(new Event('storage'))
      // Redirect based on role
      if (data.user?.role === 'provider') {
        router.push('/provider-dashboard')
      } else {
        router.push('/')
      }
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Signup failed')
    },
  })

  const providerSignupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user))
      // Trigger storage event to update navigation
      window.dispatchEvent(new Event('storage'))
      // Redirect to provider dashboard
      router.push('/provider-dashboard')
    },
    onError: (error: any) => {
      setError(error.response?.data?.error || 'Signup failed')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    signupMutation.mutate(formData)
  }

  const handleProviderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!providerFormData.serviceType) {
      setError('Please select a service type')
      return
    }
    
    providerSignupMutation.mutate({
      name: providerFormData.name,
      businessName: providerFormData.businessName,
      email: providerFormData.email,
      password: providerFormData.password,
      phone: providerFormData.phone,
      userType: 'provider',
      serviceType: providerFormData.serviceType,
      address: providerFormData.address,
      experienceYears: providerFormData.experienceYears,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProviderFormData({ ...providerFormData, [e.target.name]: e.target.value })
  }

  const serviceTypes = [
    'Cleaning',
    'Plumbing',
    'Electrical',
    'Handyman',
    'Gardening',
    'Pest Control',
    'Locksmith',
    'Mechanic',
    'Air Conditioning',
    'Sneaker Cleaning',
  ]

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#111827] mb-2">
              {activeTab === 'customer' ? 'Create Account' : 'Become a Provider'}
            </h1>
            <p className="text-[#6B7280]">
              {activeTab === 'customer' ? 'Join HomeSwift today' : 'Join HomeSwift as a service provider'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('customer')
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'customer'
                  ? 'bg-white text-[#2563EB] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('provider')
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'provider'
                  ? 'bg-white text-[#10B981] shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Service Provider
            </button>
          </div>

          {/* Customer Signup Form */}
          {activeTab === 'customer' && (
            <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#111827] mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111827] mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111827] mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                placeholder="0#########"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111827] mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                placeholder="••••••••"
              />
            </div>

              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="w-full bg-[#2563EB] text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-[#1E40AF] hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none"
              >
                {signupMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          )}

          {/* Provider Signup Form */}
          {activeTab === 'provider' && (
            <form onSubmit={handleProviderSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={providerFormData.name}
                  onChange={handleProviderChange}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={providerFormData.businessName}
                  onChange={handleProviderChange}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="ABC Cleaning Services"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={providerFormData.email}
                  onChange={handleProviderChange}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={providerFormData.phone}
                  onChange={handleProviderChange}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="0#########"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">Service Type *</label>
                <select
                  name="serviceType"
                  value={providerFormData.serviceType}
                  onChange={handleProviderChange}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all text-[#111827] bg-white"
                >
                  <option value="">Select a service type</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={providerFormData.address}
                  onChange={handleProviderChange}
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="Your business address"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">Years of Experience</label>
                <input
                  type="number"
                  name="experienceYears"
                  value={providerFormData.experienceYears}
                  onChange={handleProviderChange}
                  min="0"
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={providerFormData.password}
                  onChange={handleProviderChange}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={providerSignupMutation.isPending}
                className="w-full bg-[#10B981] text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-[#059669] hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none"
              >
                {providerSignupMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating account...
                  </span>
                ) : (
                  'Sign Up as Provider'
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[#6B7280]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#2563EB] font-bold hover:underline">
                Sign in
              </Link>
            </p>
            {activeTab === 'customer' && (
              <p className="text-[#6B7280] mt-2">
                Are you a service provider?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('provider')
                    setError('')
                  }}
                  className="text-[#10B981] font-bold hover:underline"
                >
                  Sign up here
                </button>
              </p>
            )}
            <Link
              href="/"
              className="mt-4 inline-block text-[#6B7280] hover:text-[#111827] font-semibold"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

