'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/lib/api'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log('Login success, user data:', data.user)
      // Store user data
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Trigger storage event to update navigation
      window.dispatchEvent(new Event('storage'))
      
      // Check if user is admin
      const isAdminUser = data.user?.role === 'admin'
      console.log('Is admin?', isAdminUser, 'Role:', data.user?.role)
      const redirectTo = searchParams.get('redirect')
      
      // Redirect based on role or redirect parameter
      if (redirectTo && isAdminUser) {
        console.log('Redirecting to:', redirectTo)
        router.push(redirectTo)
      } else if (isAdminUser) {
        console.log('Redirecting to admin dashboard')
        router.push('/admin')
      } else {
        console.log('Redirecting to home page')
        router.push('/')
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error)
      setError(error.response?.data?.error || 'Login failed')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    loginMutation.mutate({ email, password })
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
            <h1 className="text-4xl font-extrabold text-[#111827] mb-2">Welcome Back</h1>
            <p className="text-[#6B7280]">Sign in to your HomeSwift account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#111827] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111827] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#2563EB] text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-[#1E40AF] hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-[#6B7280]">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#2563EB] font-bold hover:underline">
                Sign up
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

