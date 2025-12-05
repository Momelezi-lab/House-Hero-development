'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import { serviceRequestApi } from '@/lib/api'

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get('request_id')
  const total = searchParams.get('total')
  
  const [paymentMethod, setPaymentMethod] = useState<'eft' | 'credit_card' | ''>('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false)
  const [paymentSubmitted, setPaymentSubmitted] = useState(false)

  const totalAmount = total ? parseFloat(total) : 0
  const depositAmount = totalAmount * 0.5 // 50% deposit

  // Check if payment already submitted
  const { data: serviceRequest, isLoading: isLoadingRequest } = useQuery({
    queryKey: ['service-request', requestId],
    queryFn: async () => {
      if (!requestId) return null
      return await serviceRequestApi.getById(parseInt(requestId))
    },
    enabled: !!requestId,
  })

  useEffect(() => {
    if (serviceRequest) {
      if (serviceRequest?.customerPaymentReceived) {
        setPaymentSubmitted(true)
      }
      if (serviceRequest?.paymentMethod) {
        setPaymentMethod(serviceRequest.paymentMethod as 'eft' | 'credit_card')
      }
    }
  }, [serviceRequest])

  // Submit payment mutation
  const submitPaymentMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`/api/payments/${requestId}`, {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Payment submission failed')
      }
      return response.json()
    },
    onSuccess: () => {
      setPaymentSubmitted(true)
      setIsSubmittingPayment(false)
      // Refetch service request to update state
      window.location.reload()
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to submit payment')
      setIsSubmittingPayment(false)
    },
  })

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!paymentMethod) {
      alert('Please select a payment method')
      return
    }

    if (paymentMethod === 'eft' && !proofFile) {
      alert('Please upload proof of payment for EFT')
      return
    }

    setIsSubmittingPayment(true)
    const formData = new FormData()
    formData.append('paymentMethod', paymentMethod)
    formData.append('depositAmount', depositAmount.toString())
    
    if (proofFile) {
      formData.append('proofOfPayment', proofFile)
    }

    submitPaymentMutation.mutate(formData)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type (images and PDFs)
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        alert('Please upload an image (JPG, PNG) or PDF file')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      setProofFile(file)
    }
  }

  if (isLoadingRequest) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A531A] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        <div className="bg-white rounded-3xl shadow-2xl p-10 text-center border-2 border-[#90B890] mb-8">
          <div className="mb-8 animate-fade-in">
            <div className="mx-auto w-24 h-24 bg-[#1A531A] rounded-full flex items-center justify-center mb-6 shadow-xl animate-pulse-glow">
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
            <h1 className="text-5xl font-extrabold text-[#1A531A] mb-4">
              Booking Request Received! 🎉
            </h1>
            <p className="text-xl text-gray-700 font-medium">
              Thank you for booking with HomeSwift. Complete your payment to confirm your booking.
            </p>
          </div>

          <div className="bg-[#90B890]/10 rounded-2xl p-8 mb-8 border-2 border-[#90B890]">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-[#90B890]">
                <span className="text-gray-700 font-semibold">Request ID:</span>
                <span className="font-extrabold text-[#1A531A] text-xl">#{requestId}</span>
              </div>
              {total && (
                <>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 font-semibold">Total Amount:</span>
                    <span className="font-extrabold text-[#1A531A] text-2xl">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t-2 border-[#90B890] pt-4">
                    <span className="text-gray-700 font-semibold">Deposit Required (50%):</span>
                    <span className="font-extrabold text-[#2563EB] text-3xl">
                      {formatCurrency(depositAmount)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Payment Section */}
        {!paymentSubmitted ? (
          <div className="bg-white rounded-3xl shadow-2xl p-10 border-2 border-gray-200">
            <h2 className="text-3xl font-bold text-[#111827] mb-2 text-center">Complete Your Payment</h2>
            <p className="text-gray-600 text-center mb-8">
              Pay 50% deposit now to confirm your booking. Balance to be paid after service completion.
            </p>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-lg font-bold text-[#111827] mb-4">
                  Select Payment Method *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('eft')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      paymentMethod === 'eft'
                        ? 'border-[#2563EB] bg-blue-50 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏦</div>
                      <h3 className="font-bold text-lg text-[#111827] mb-1">EFT Transfer</h3>
                      <p className="text-sm text-gray-600">Bank transfer with proof</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-[#2563EB] bg-blue-50 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">💳</div>
                      <h3 className="font-bold text-lg text-[#111827] mb-1">Credit Card</h3>
                      <p className="text-sm text-gray-600">Instant payment</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* EFT Details */}
              {paymentMethod === 'eft' && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 space-y-4">
                  <h3 className="font-bold text-lg text-[#111827]">EFT Payment Instructions</h3>
                  <div className="bg-white rounded-lg p-4 space-y-2">
                    <p className="text-sm text-gray-600"><strong>Bank:</strong> Standard Bank</p>
                    <p className="text-sm text-gray-600"><strong>Account Name:</strong> HomeSwift Services</p>
                    <p className="text-sm text-gray-600"><strong>Account Number:</strong> 1234567890</p>
                    <p className="text-sm text-gray-600"><strong>Reference:</strong> #{requestId}</p>
                    <p className="text-sm text-gray-600"><strong>Amount:</strong> {formatCurrency(depositAmount)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-[#111827] mb-2">
                      Upload Proof of Payment *
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      required
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Upload a screenshot or PDF of your payment confirmation (Max 5MB)
                    </p>
                    {proofFile && (
                      <p className="text-sm text-green-600 mt-2 font-semibold">
                        ✓ File selected: {proofFile.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Credit Card Payment Info */}
              {paymentMethod === 'credit_card' && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-[#111827] mb-2">Credit Card Payment</h3>
                  <p className="text-gray-700 mb-4">
                    You will be redirected to a secure payment gateway to complete your payment of{' '}
                    <strong>{formatCurrency(depositAmount)}</strong>.
                  </p>
                  <p className="text-sm text-gray-600">
                    💳 We accept Visa, Mastercard, and American Express
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingPayment || !paymentMethod || (paymentMethod === 'eft' && !proofFile)}
                className="w-full bg-[#2563EB] hover:bg-[#1E40AF] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:transform-none text-lg"
              >
                {isSubmittingPayment ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing Payment...
                  </span>
                ) : (
                  `Pay ${formatCurrency(depositAmount)} Deposit`
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-green-50 border-2 border-green-200 rounded-3xl shadow-2xl p-10 text-center">
            <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-white"
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
            <h2 className="text-3xl font-bold text-green-700 mb-4">Payment Submitted!</h2>
            <p className="text-lg text-gray-700 mb-2">
              Your payment has been received and is being processed.
            </p>
            {paymentMethod === 'eft' && (
              <p className="text-sm text-gray-600 mb-6">
                We're verifying your proof of payment. You'll receive confirmation within 2 hours.
              </p>
            )}
            {paymentMethod === 'credit_card' && (
              <p className="text-sm text-gray-600 mb-6">
                Your payment is being processed. You'll receive confirmation shortly.
              </p>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/"
            className="bg-[#1A531A] hover:bg-[#1A531A]/90 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all text-center"
          >
            🏠 Back to Home
          </Link>
          <Link
            href="/profile"
            className="bg-white border-2 border-[#1A531A] text-[#1A531A] hover:bg-[#90B890]/10 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-center"
          >
            📋 View My Bookings
          </Link>
        </div>
      </div>
    </div>
  )
}
