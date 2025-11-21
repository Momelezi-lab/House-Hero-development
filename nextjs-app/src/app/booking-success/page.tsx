'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get('request_id')
  const total = searchParams.get('total')

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-10 text-center border-2 border-green-200">
        <div className="mb-8 animate-fade-in">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl animate-pulse-glow">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Thank you for booking with HomeSwift. Your service request has been received.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 mb-8 border-2 border-blue-200">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-blue-200">
              <span className="text-gray-700 font-semibold">Request ID:</span>
              <span className="font-extrabold text-blue-900 text-xl">#{requestId}</span>
            </div>
            {total && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700 font-semibold">Total Amount:</span>
                <span className="font-extrabold text-green-600 text-3xl">
                  {formatCurrency(parseFloat(total))}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            We're finding the best provider for you and will confirm within 2 hours.
          </p>
          <p className="text-sm text-gray-500">
            You'll receive a confirmation email shortly with all the details.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            🏠 Back to Home
          </Link>
          <Link
            href="/book-service"
            className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            ➕ Book Another Service
          </Link>
        </div>
      </div>
    </div>
  )
}

