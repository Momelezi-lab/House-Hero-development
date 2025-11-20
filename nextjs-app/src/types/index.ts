// Type definitions for the application

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  registered: string
  createdAt: Date
  updatedAt: Date
}

export interface Booking {
  id: number
  name: string
  address: string
  date: string
  time: string
  service: string
  details?: string
  status: string
  amount: number
  createdAt: Date
  updatedAt: Date
}

export interface Complaint {
  id: number
  name: string
  email?: string
  type: string
  title: string
  description: string
  status: string
  date: string
  serviceProvider?: string
  desiredResolution?: string
  contactPreference?: string
  urgencyLevel?: string
  serviceDate?: string
  isAnonymous: boolean
  followUpEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ServiceProvider {
  id: number
  name: string
  serviceType: string
  phone: string
  email: string
  address?: string
  experienceYears: number
  hourlyRate: number
  rating: number
  totalBookings: number
  status: string
  registered: string
  createdAt: Date
  updatedAt: Date
}

export interface ServicePricing {
  id: number
  serviceCategory: string
  serviceType: string
  itemDescription?: string
  providerBasePrice: number
  customerDisplayPrice: number
  colorSurchargeProvider: number
  colorSurchargeCustomer: number
  isWhiteApplicable: boolean
  commissionPercentage: number
  createdAt: Date
  updatedAt: Date
}

export interface Customer {
  customerId: number
  customerName: string
  customerEmail: string
  customerPhone: string
  savedAddresses?: string[]
  totalBookings: number
  createdAt: Date
}

export interface ServiceRequestItem {
  category: string
  type: string
  quantity: number
  is_white: boolean
}

export interface ServiceRequest {
  requestId: number
  customerId?: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  unitNumber?: string
  complexName?: string
  accessInstructions?: string
  preferredDate: string
  preferredTime: string
  additionalNotes?: string
  selectedItems: ServiceRequestItem[]
  totalCustomerPaid: number
  totalProviderPayout: number
  totalCommissionEarned: number
  status: string
  priority: string
  assignedProviderId?: number
  providerName?: string
  providerPhone?: string
  providerEmail?: string
  paymentMethod?: string
  customerPaymentReceived: boolean
  providerPaymentMade: boolean
  commissionCollected: boolean
  adminNotes?: string
  createdAt: Date
  updatedAt: Date
  confirmedAt?: Date
  completedAt?: Date
  reminderSentAt?: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

