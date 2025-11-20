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

  // Fetch pricing for selected category
  const { data: pricingData } = useQuery({
    queryKey: ['pricing', selectedCategory],
    queryFn: () => pricingApi.getPricingByCategory(selectedCategory!),
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

  // Generate time slots
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

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0]

  const subtotal = calculateSubtotal()
  const total = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded-full shadow-lg transition-colors"
      >
        &lt;
      </Link>

      {/* Header */}
      <header className="bg-blue-900 text-white py-8 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Request a Service</h1>
          <p className="text-lg text-blue-100">Book your cleaning service with transparent pricing</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Service Selection */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Your Services</h2>

                {/* Category Selection */}
                {!selectedCategory && (
                  <div id="category-selection">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700">
                      Choose a Service Category
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {SERVICE_CATEGORIES.map((category) => (
                        <div
                          key={category}
                          onClick={() => handleCategorySelect(category)}
                          className="category-card bg-blue-50 border-2 border-blue-200 rounded-lg p-4 cursor-pointer hover:bg-blue-100 hover:border-blue-400 transition-all"
                        >
                          <h4 className="font-semibold text-gray-800 mb-2">{category}</h4>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pricingData?.map((item: any) => (
                        <div
                          key={item.id}
                          className="service-type-card bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-gray-800">{item.serviceType}</h4>
                            <span className="text-lg font-bold text-blue-600">
                              {formatCurrency(parseFloat(item.customerDisplayPrice.toString()))}
                            </span>
                          </div>
                          {item.isWhiteApplicable && (
                            <p className="text-xs text-gray-500 mb-2">
                              +{formatCurrency(parseFloat(item.colorSurchargeCustomer.toString()))}{' '}
                              if white
                            </p>
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
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            Add to Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Schedule & Location */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Schedule & Location</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="preferred_date"
                        min={today}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        name="preferred_time"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Complex Name
                      </label>
                      <input
                        type="text"
                        name="complex_name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors shadow-lg"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">YOUR BOOKING</h2>
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
                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{item.type}</h4>
                              <p className="text-sm text-gray-600">{item.category}</p>
                              {item.isWhite && (
                                <p className="text-xs text-blue-600 mt-1">
                                  ✓ White (+{formatCurrency(item.pricing.color_surcharge_customer)})
                                </p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-800 font-medium text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <label className="text-sm text-gray-700">Qty:</label>
                              <input
                                type="number"
                                min={1}
                                max={10}
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateQuantity(index, parseInt(e.target.value) || 1)
                                }
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                              />
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">{formatCurrency(price)} each</p>
                              <p className="text-lg font-bold text-blue-600">
                                {formatCurrency(lineTotal)}
                              </p>
                            </div>
                          </div>
                          {item.pricing.is_white_applicable && (
                            <div className="mt-2">
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={item.isWhite}
                                  onChange={(e) => handleToggleWhite(index, e.target.checked)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                                />
                                <span className="text-sm text-gray-700">
                                  Is this item white? (+
                                  {formatCurrency(item.pricing.color_surcharge_customer)})
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
                <div className="flex justify-between items-center mb-2 border-t border-gray-200 pt-2">
                  <span className="text-lg font-bold text-gray-800">TOTAL:</span>
                  <span className="text-2xl font-bold text-green-600">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-700">Processing your booking...</p>
          </div>
        </div>
      )}
    </div>
  )
}

