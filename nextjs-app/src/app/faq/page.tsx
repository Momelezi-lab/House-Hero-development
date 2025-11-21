'use client'

import { useState } from 'react'
import Link from 'next/link'

const faqs = [
  {
    question: 'How do I book a service?',
    answer: 'Simply click on "Book Cleaning Service" on the home page, select your service category, choose the specific service type, add it to your cart, and fill in your details.',
  },
  {
    question: 'What is the callout fee?',
    answer: 'A R100 callout fee is charged on all bookings. This covers travel and initial assessment costs.',
  },
  {
    question: 'How long does a service take?',
    answer: 'Service duration varies by type. Standard cleaning typically takes 2-4 hours, while deep cleaning can take 4-8 hours.',
  },
  {
    question: 'Can I cancel or reschedule?',
    answer: 'Yes! Contact us at least 24 hours before your scheduled service to cancel or reschedule without penalty.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, card payments, and bank transfers. Payment is typically made after service completion.',
  },
  {
    question: 'Are your service providers insured?',
    answer: 'Yes, all our service providers are fully insured and background checked for your peace of mind.',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white py-12 px-4 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 font-semibold"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Frequently Asked Questions</h1>
          <p className="text-xl text-blue-100">Find answers to common questions</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-blue-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-gray-900 pr-4">{faq.question}</h3>
                <span className="text-2xl text-blue-600 font-bold flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 pt-0 animate-fade-in">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

