'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })
  const [error, setError] = useState('')

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user))
      // Redirect to home
      router.push('/')
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#111827] mb-2">Create Account</h1>
            <p className="text-[#6B7280]">Join HomeSwift today</p>
          </div>

          {/* Form */}
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

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[#6B7280]">
              Already have an account?{' '}
              <Link href="/login" className="text-[#2563EB] font-bold hover:underline">
                Sign in
              </Link>
            </p>
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

