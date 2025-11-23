'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { providerApi } from '@/lib/api'
import Link from 'next/link'

export default function ProvidersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState<any>(null)
  
  // Debug logging
  useEffect(() => {
    console.log('ProvidersPage mounted/updated - isAddModalOpen:', isAddModalOpen, 'editingProvider:', editingProvider)
  }, [isAddModalOpen, editingProvider])
  
  // Test button handler
  const handleAddClick = () => {
    console.log('=== handleAddClick called ===')
    console.log('Before: isAddModalOpen =', isAddModalOpen)
    setIsAddModalOpen(true)
    console.log('After: setIsAddModalOpen(true) called')
  }

  const { data: providers, isLoading, refetch } = useQuery({
    queryKey: ['providers'],
    queryFn: () => providerApi.getAll(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => providerApi.delete(id),
    onSuccess: () => {
      refetch()
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A531A]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-[#2563EB] hover:text-[#2563EB]/80 font-semibold mb-4"
          >
            ← Back to Admin Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#111827] mb-2">Service Providers</h1>
              <p className="text-gray-600">Manage your service providers</p>
            </div>
            <button
              type="button"
              onClick={handleAddClick}
              style={{ zIndex: 1000, position: 'relative', pointerEvents: 'auto' }}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#2563EB]/90 hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer"
            >
              + Add Provider
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers?.map((provider: any) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onEdit={() => setEditingProvider(provider)}
              onDelete={() => {
                if (confirm(`Delete provider ${provider.name}?`)) {
                  deleteMutation.mutate(provider.id)
                }
              }}
            />
          ))}
        </div>

        {providers?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <p className="text-gray-600 mb-4">No providers found</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#2563EB]/90"
            >
              Add Your First Provider
            </button>
          </div>
        )}

        {(isAddModalOpen || editingProvider) && (
          <ProviderModal
              provider={editingProvider}
              onClose={() => {
                console.log('Modal onClose called')
                setIsAddModalOpen(false)
                setEditingProvider(null)
              }}
              onSuccess={() => {
                console.log('Modal onSuccess called')
                setIsAddModalOpen(false)
                setEditingProvider(null)
                refetch()
              }}
            />
        )}
      </div>
    </div>
  )
}

function ProviderCard({
  provider,
  onEdit,
  onDelete,
}: {
  provider: any
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transform hover:scale-105 transition-all">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-[#2563EB] rounded-full flex items-center justify-center text-2xl text-white font-bold">
          {provider.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#111827]">{provider.name}</h3>
          <p className="text-gray-600">{provider.serviceType}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center gap-2">
          <span>📞</span>
          <span>{provider.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>✉️</span>
          <span className="truncate">{provider.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>⭐</span>
          <span>Rating: {provider.rating?.toFixed(1) || '0.0'}</span>
        </div>
        {provider.address && (
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span className="truncate">{provider.address}</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB]/90 font-semibold transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

function ProviderModal({
  provider,
  onClose,
  onSuccess,
}: {
  provider?: any
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    name: provider?.name || '',
    serviceType: provider?.serviceType || '',
    phone: provider?.phone || '',
    email: provider?.email || '',
    address: provider?.address || '',
    experienceYears: provider?.experienceYears || 0,
    hourlyRate: provider?.hourlyRate || 0,
    rating: provider?.rating || 0,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      console.log('Calling providerApi.create with:', data)
      return providerApi.create(data)
    },
    onSuccess: (response) => {
      setError('')
      setSuccess('Provider created successfully!')
      console.log('Provider created successfully:', response)
      // Reset form
      setFormData({
        name: '',
        serviceType: '',
        phone: '',
        email: '',
        address: '',
        experienceYears: 0,
        hourlyRate: 0,
        rating: 0,
      })
      // Close modal after a short delay to show success message
      setTimeout(() => {
        onSuccess()
      }, 1000)
    },
    onError: (error: any) => {
      console.error('Create provider error - full error:', error)
      console.error('Error response:', error.response)
      console.error('Error data:', error.response?.data)
      console.error('Error message:', error.message)
      const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || 'Failed to create provider'
      setError(errorMessage)
      setSuccess('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      providerApi.update(id, data),
    onSuccess: (response) => {
      setError('')
      console.log('Provider updated successfully:', response)
      onSuccess()
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update provider'
      setError(errorMessage)
      console.error('Update provider error:', error)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Validate required fields
    if (!formData.name || !formData.serviceType || !formData.phone || !formData.email) {
      setError('Please fill in all required fields')
      return
    }
    
    const submitData = {
      ...formData,
      registered: new Date().toISOString().split('T')[0],
      status: 'active',
    }
    
    console.log('Submitting provider data:', submitData)
    
    if (provider) {
      console.log('Updating provider:', provider.id)
      updateMutation.mutate({ id: provider.id, data: formData })
    } else {
      console.log('Creating new provider')
      createMutation.mutate(submitData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 9999, position: 'fixed' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-[#2563EB] text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {provider ? 'Edit Provider' : 'Add New Provider'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl">
              <strong>Error:</strong> {error}
            </div>
          )}
          {success && (
            <div className="bg-[#10B981]/10 border border-[#10B981] text-[#10B981] px-4 py-3 rounded-xl">
              {success}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-[#111827]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Service Type *</label>
              <input
                type="text"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                required
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-[#111827]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-[#111827]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-[#111827]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-[#111827]"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Experience (Years)</label>
              <input
                type="number"
                value={formData.experienceYears}
                onChange={(e) =>
                  setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-[#111827]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Hourly Rate</label>
              <input
                type="number"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-[#111827]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] text-[#111827]"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 px-6 py-3 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#2563EB]/90 hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : provider
                ? 'Update Provider'
                : 'Create Provider'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

