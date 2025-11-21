'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { providerApi } from '@/lib/api'
import Link from 'next/link'

export default function ProvidersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState<any>(null)

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-4"
          >
            ← Back to Admin Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Service Providers</h1>
              <p className="text-gray-600">Manage your service providers</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all"
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
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold"
            >
              Add Your First Provider
            </button>
          </div>
        )}

        {(isAddModalOpen || editingProvider) && (
          <ProviderModal
            provider={editingProvider}
            onClose={() => {
              setIsAddModalOpen(false)
              setEditingProvider(null)
            }}
            onSuccess={() => {
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
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl text-white font-bold">
          {provider.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
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
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
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

  const createMutation = useMutation({
    mutationFn: (data: any) => providerApi.create(data),
    onSuccess,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      providerApi.update(id, data),
    onSuccess,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (provider) {
      updateMutation.mutate({ id: provider.id, data: formData })
    } else {
      createMutation.mutate({
        ...formData,
        registered: new Date().toISOString().split('T')[0],
        status: 'active',
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex items-center justify-between">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Service Type *</label>
              <input
                type="text"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
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

