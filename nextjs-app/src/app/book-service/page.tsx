'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { pricingApi, serviceRequestApi } from '@/lib/api'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'

const CALLOUT_FEE = 100

interface CartItem {
  category: string
  type: string
  quantity: number
  isWhite: boolean
  pricing: {
    customer_display_price: number
    is_white_applicable: boolean
    color_surcharge_customer: number
  }
}

const SERVICE_CATEGORIES = [
  'Couch Deep Cleaning',
  'Carpet Deep Cleaning',
  'Fitted Carpet Deep Cleaning',
  'Mattress Deep Cleaning',
  'Headboard Deep Cleaning',
  'Sleigh Bed Deep Cleaning',
  'Standard Apartment Cleaning',
  'Apartment Spring Cleaning',
  'Apartment Deep Cleaning',
  'Empty Apartment Deep Cleaning',
  'House Spring Cleaning',
  'House Deep Cleaning',
  'Empty House Deep Cleaning',
]

export default function BookServicePage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [today, setToday] = useState<string>('')

  // Set today's date on client side only to avoid hydration mismatch
  useEffect(() => {
    setToday(new Date().toISOString().split('T')[0])
  }, [])

  // Fetch pricing for selected category
  const { data: pricingData, isLoading: isLoadingPricing, error: pricingError } = useQuery({
    queryKey: ['pricing', selectedCategory],
    queryFn: async () => {
      const data = await pricingApi.getPricingByCategory(selectedCategory!)
      console.log('Pricing data received:', data)
      return data
    },
    enabled: !!selectedCategory,
  })

  // Create service request mutation
  const createRequestMutation = useMutation({
    mutationFn: serviceRequestApi.create,
    onSuccess: (data) => {
      router.push(
        `/booking-success?request_id=${data.request_id}&total=${data.total_customer_paid}`
      )
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || 'Error creating booking')
      setIsSubmitting(false)
    },
  })

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
  }

  const handleAddToCart = (
    category: string,
    type: string,
    price: number,
    isWhiteApplicable: boolean,
    whiteSurcharge: number
  ) => {
    const quantityStr = prompt(
      `How many "${type}" would you like?\n\nBase Price: R${price.toFixed(2)}${
        isWhiteApplicable ? `\nWhite Surcharge: +R${whiteSurcharge.toFixed(2)}` : ''
      }\n\nEnter quantity (1-10):`,
      '1'
    )

    if (!quantityStr) return

    let quantity = parseInt(quantityStr) || 1
    if (quantity < 1) quantity = 1
    if (quantity > 10) quantity = 10

    let isWhite = false
    if (isWhiteApplicable) {
      isWhite = confirm(
        `Is this item white?\n\nThis will add R${whiteSurcharge.toFixed(2)} per item.\n\nClick OK if white, Cancel if not.`
      )
    }

    const newItem: CartItem = {
      category,
      type,
      quantity,
      isWhite,
      pricing: {
        customer_display_price: price,
        is_white_applicable: isWhiteApplicable,
        color_surcharge_customer: whiteSurcharge,
      },
    }

    setCartItems([...cartItems, newItem])
  }

  const handleRemoveItem = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index))
  }

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity < 1 || quantity > 10) return
    const updated = [...cartItems]
    updated[index].quantity = quantity
    setCartItems(updated)
  }

  const handleToggleWhite = (index: number, checked: boolean) => {
    const updated = [...cartItems]
    updated[index].isWhite = checked
    setCartItems(updated)
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      let price = item.pricing.customer_display_price
      if (item.isWhite && item.pricing.is_white_applicable) {
        price += item.pricing.color_surcharge_customer
      }
      return sum + price * item.quantity
    }, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + CALLOUT_FEE
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (cartItems.length === 0) {
      alert('Please add at least one service item to your cart')
      return
    }

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    const bookingData = {
      customer_name: formData.get('customer_name') as string,
      customer_email: formData.get('customer_email') as string,
      customer_phone: formData.get('customer_phone') as string,
      customer_address: formData.get('customer_address') as string,
      unit_number: formData.get('unit_number') as string,
      complex_name: formData.get('complex_name') as string,
      access_instructions: formData.get('access_instructions') as string,
      preferred_date: formData.get('preferred_date') as string,
      preferred_time: formData.get('preferred_time') as string,
      additional_notes: formData.get('additional_notes') as string,
      items: cartItems.map((item) => ({
        category: item.category,
        type: item.type,
        quantity: item.quantity,
        is_white: item.isWhite,
      })),
    }

    createRequestMutation.mutate(bookingData)
  }

  // Generate time slots (static, no hydration issues)
  const timeSlots = []
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const period = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
      timeSlots.push({ value: timeStr, display: displayTime })
    }
  }

  const subtotal = calculateSubtotal()
  const total = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 bg-white hover:bg-blue-50 text-gray-700 font-bold py-3 px-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 border-2 border-blue-200"
      >
        ← Back
      </Link>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white py-12 px-4 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/20 rounded-full -ml-24 -mb-24"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block mb-4 text-5xl">🧹</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">
            Request a Service
          </h1>
          <p className="text-xl text-blue-100 font-medium">
            Book your cleaning service with transparent pricing
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Service Selection */}
              <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                    ✨
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Select Your Services</h2>
                </div>

                {/* Category Selection - Always show when no category selected */}
                {!selectedCategory && (
                  <div id="category-selection" className="w-full">
                    <h3 className="text-lg font-semibold mb-6 text-gray-700">
                      Choose a Service Category
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {SERVICE_CATEGORIES.map((category, index) => (
                        <div
                          key={`category-${category}-${index}`}
                          onClick={() => handleCategorySelect(category)}
                          className="group category-card bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5 cursor-pointer hover:bg-gradient-to-br hover:from-blue-100 hover:to-cyan-100 hover:border-blue-400 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              handleCategorySelect(category)
                            }
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors text-base">
                              {category}
                            </h4>
                            <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                              →
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Click to view options</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Service Type Selection */}
                {selectedCategory && (
                  <div id="service-type-selection">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">
                        {selectedCategory}
                      </h3>
                      <button
                        type="button"
                        onClick={handleBackToCategories}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        ← Back to Categories
                      </button>
                    </div>
                    
                    {/* Loading State */}
                    {isLoadingPricing && (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading service options...</p>
                      </div>
                    )}

                    {/* Error State */}
                    {pricingError && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
                        <p className="text-red-800 font-semibold">Error loading services</p>
                        <p className="text-red-600 text-sm mt-1">
                          {(pricingError as any)?.response?.data?.error || (pricingError as any)?.message || 'Failed to load service options'}
                        </p>
                      </div>
                    )}

                    {/* No Data State */}
                    {!isLoadingPricing && !pricingError && (!pricingData || pricingData.length === 0) && (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
                        <p className="text-yellow-800 font-semibold mb-2">No service options available</p>
                        <p className="text-yellow-600 text-sm">
                          No pricing data found for "{selectedCategory}". Please check the database or contact support.
                        </p>
                      </div>
                    )}

                    {/* Service Options */}
                    {!isLoadingPricing && !pricingError && pricingData && pricingData.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pricingData.map((item: any, index: number) => (
                        <div
                          key={item.id}
                          className="group service-type-card bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-gray-900 text-lg">{item.serviceType}</h4>
                            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                              {formatCurrency(parseFloat(item.customerDisplayPrice.toString()))}
                            </span>
                          </div>
                          {item.isWhiteApplicable && (
                            <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                              <p className="text-xs text-amber-800 font-medium">
                                ⚪ +{formatCurrency(parseFloat(item.colorSurchargeCustomer.toString()))}{' '}
                                if white
                              </p>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              handleAddToCart(
                                item.serviceCategory,
                                item.serviceType,
                                parseFloat(item.customerDisplayPrice.toString()),
                                item.isWhiteApplicable,
                                parseFloat(item.colorSurchargeCustomer.toString())
                              )
                            }
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            ➕ Add to Cart
                          </button>
                        </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Schedule & Location */}
              <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-2xl">
                    📅
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Schedule & Location</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferred_date"
                        min={today || undefined}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferred_time"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.display}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <input
                      type="text"
                      name="customer_address"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Number
                      </label>
                      <input
                        type="text"
                        name="unit_number"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complex Name
                      </label>
                      <input
                        type="text"
                        name="complex_name"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Access Instructions
                    </label>
                    <textarea
                      name="access_instructions"
                      rows={3}
                      placeholder="Gate code, building access, etc."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                    📞
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Contact Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="customer_phone"
                        placeholder="0#########"
                        maxLength={10}
                        pattern="[0-9]{10}"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">10 digits (South African format)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="customer_email"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="additional_notes"
                      rows={3}
                      placeholder="Any special requests or details we should know?"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    />
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-5 px-6 rounded-2xl text-xl transition-all shadow-2xl hover:shadow-blue-500/50 transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>✅</span>
                    <span>Confirm Booking</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                  🛒
                </div>
                <h2 className="text-2xl font-bold text-gray-900">YOUR BOOKING</h2>
              </div>
              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <div className="space-y-2 text-sm">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500">Add items to see your booking summary</p>
                  ) : (
                    cartItems.map((item, index) => {
                      let price = item.pricing.customer_display_price
                      if (item.isWhite && item.pricing.is_white_applicable) {
                        price += item.pricing.color_surcharge_customer
                      }
                      const lineTotal = price * item.quantity
                      return (
                        <div key={`cart-item-${item.category}-${item.type}-${index}`} className="bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 text-lg">{item.type}</h4>
                              <p className="text-sm text-gray-600 mb-1">{item.category}</p>
                              {item.isWhite && (
                                <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold mt-1">
                                  <span>⚪</span>
                                  <span>White (+{formatCurrency(item.pricing.color_surcharge_customer)})</span>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-800 font-bold text-lg hover:scale-110 transition-transform"
                              title="Remove item"
                            >
                              ×
                            </button>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <label className="text-sm font-semibold text-gray-700">Qty:</label>
                              <input
                                type="number"
                                min={1}
                                max={10}
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateQuantity(index, parseInt(e.target.value) || 1)
                                }
                                className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600 mb-1">Unit Price</p>
                              <p className="text-sm font-semibold text-gray-700">{formatCurrency(price)}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <span className="text-sm font-semibold text-gray-700">Line Total:</span>
                            <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                              {formatCurrency(lineTotal)}
                            </span>
                          </div>
                          {item.pricing.is_white_applicable && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <label className="flex items-center space-x-2 cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={item.isWhite}
                                  onChange={(e) => handleToggleWhite(index, e.target.checked)}
                                  className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                  Is this item white? (+{formatCurrency(item.pricing.color_surcharge_customer)})
                                </span>
                              </label>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                {cartItems.length > 0 && (
                  <div className="mb-2">
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                      <span>Callout Fee:</span>
                      <span>{formatCurrency(CALLOUT_FEE)}</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center mb-2 border-t-2 border-gray-300 pt-4">
                  <span className="text-xl font-bold text-gray-900">TOTAL:</span>
                  <span className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {formatCurrency(total)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">All prices include service fees</p>
                <p className="text-xs text-gray-500 italic">
                  Final price confirmed after assessment. You'll receive confirmation within 2 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md mx-4 border-2 border-blue-200">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Booking</h3>
            <p className="text-gray-600">Please wait while we confirm your service request...</p>
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

