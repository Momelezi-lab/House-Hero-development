'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { serviceRequestApi, providerApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  // Fetch service requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ['service-requests'],
    queryFn: () => serviceRequestApi.getAll(),
  })

  // Fetch providers
  const { data: providers } = useQuery({
    queryKey: ['providers'],
    queryFn: () => providerApi.getAll(),
  })

  // Calculate stats
  const stats = {
    total: requests?.length || 0,
    pending: requests?.filter((r: any) => r.status === 'pending').length || 0,
    confirmed: requests?.filter((r: any) => r.status === 'confirmed').length || 0,
    completed: requests?.filter((r: any) => r.status === 'completed').length || 0,
    revenue: requests
      ?.filter((r: any) => r.status === 'completed')
      .reduce((sum: number, r: any) => sum + (parseFloat(r.totalCustomerPaid?.toString() || '0') || 0), 0) || 0,
    commission: requests
      ?.filter((r: any) => r.status === 'completed')
      .reduce((sum: number, r: any) => sum + (parseFloat(r.totalCommissionEarned?.toString() || '0') || 0), 0) || 0,
  }

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      serviceRequestApi.update(id, data),
    onSuccess: () => {
      setSelectedRequest(null)
      // Refetch requests
    },
  })

  const handleUpdateStatus = (requestId: number, status: string) => {
    updateRequestMutation.mutate({
      id: requestId,
      data: { status },
    })
  }

  const handleAssignProvider = (requestId: number, providerId: number) => {
    const provider = providers?.find((p: any) => p.id === providerId)
    updateRequestMutation.mutate({
      id: requestId,
      data: {
        status: 'confirmed',
        assignedProviderId: providerId,
        providerName: provider?.name,
        providerPhone: provider?.phone,
        providerEmail: provider?.email,
      },
    })
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📋' },
    { id: 'providers', label: 'Providers', icon: '👥' },
    { id: 'financial', label: 'Financial', icon: '💰' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl">
        <div className="p-6 border-b border-blue-700">
          <h2 className="text-2xl font-bold">HomeSwift</h2>
          <p className="text-blue-200 text-sm">Admin Dashboard</p>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSection === item.id
                  ? 'bg-white text-blue-900 shadow-lg transform scale-105'
                  : 'text-blue-100 hover:bg-blue-700/50'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/"
            className="block w-full text-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
          >
            🚪 Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeSection === 'dashboard' && (
          <DashboardView stats={stats} requests={requests || []} />
        )}
        {activeSection === 'bookings' && (
          <BookingsView
            requests={requests || []}
            isLoading={isLoading}
            onSelectRequest={setSelectedRequest}
            onUpdateStatus={handleUpdateStatus}
            onAssignProvider={handleAssignProvider}
            providers={providers || []}
          />
        )}
        {activeSection === 'providers' && (
          <ProvidersView providers={providers || []} />
        )}
        {activeSection === 'financial' && (
          <FinancialView stats={stats} requests={requests || []} />
        )}

        {/* Request Details Modal */}
        {selectedRequest && (
          <RequestDetailsModal
            request={selectedRequest}
            providers={providers || []}
            onClose={() => setSelectedRequest(null)}
            onUpdate={updateRequestMutation.mutate}
          />
        )}
      </main>
    </div>
  )
}

function DashboardView({ stats, requests }: { stats: any; requests: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value={stats.total}
          icon="📋"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon="⏳"
          gradient="from-amber-500 to-orange-500"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon="✅"
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(stats.revenue)}
          icon="💰"
          gradient="from-purple-500 to-pink-500"
        />
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left rounded-tl-lg">ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.slice(0, 10).map((request: any) => (
                <tr key={request.requestId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">#{request.requestId}</td>
                  <td className="px-4 py-3">{request.customerName}</td>
                  <td className="px-4 py-3">
                    {new Date(request.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-bold text-green-600">
                    {formatCurrency(parseFloat(request.totalCustomerPaid?.toString() || '0'))}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        request.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-blue-600 hover:text-blue-800 font-semibold">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  gradient,
}: {
  title: string
  value: string | number
  icon: string
  gradient: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Format currency only on client to avoid hydration mismatch
  const displayValue = typeof value === 'string' && value.includes('R') 
    ? (mounted ? value : 'R 0.00') 
    : value

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-3xl shadow-lg`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-extrabold text-gray-900" suppressHydrationWarning>
        {displayValue}
      </p>
    </div>
  )
}

function BookingsView({
  requests,
  isLoading,
  onSelectRequest,
  onUpdateStatus,
  onAssignProvider,
  providers,
}: {
  requests: any[]
  isLoading: boolean
  onSelectRequest: (request: any) => void
  onUpdateStatus: (id: number, status: string) => void
  onAssignProvider: (id: number, providerId: number) => void
  providers: any[]
}) {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredRequests = requests.filter((r: any) => {
    const matchesStatus = statusFilter === 'all' ? true : r.status === statusFilter
    const matchesSearch = searchQuery === '' || 
      r.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestId?.toString().includes(searchQuery) ||
      r.customerPhone?.includes(searchQuery)
    return matchesStatus && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Service Requests</h1>
          <p className="text-gray-600">Manage all service bookings</p>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name, email, ID, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-[300px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      
      {filteredRequests.length === 0 && requests.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-4">
          <p className="text-yellow-800 font-semibold">No requests found matching your search criteria.</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Service</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request: any) => (
                <tr
                  key={request.requestId}
                  className="border-b hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => onSelectRequest(request)}
                >
                  <td className="px-6 py-4 font-bold text-blue-600">
                    #{request.requestId}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold">{request.customerName}</div>
                      <div className="text-sm text-gray-500">{request.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {JSON.parse(request.selectedItems || '[]')[0]?.category || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(request.preferredDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    {formatCurrency(parseFloat(request.totalCustomerPaid?.toString() || '0'))}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        request.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectRequest(request)
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ProvidersView({ providers }: { providers: any[] }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState<any>(null)

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider: any) => (
          <div
            key={provider.id}
            className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                {provider.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
                <p className="text-gray-600">{provider.serviceType}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>{provider.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✉️</span>
                <span>{provider.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⭐</span>
                <span>Rating: {provider.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                Edit
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FinancialView({ stats, requests }: { stats: any; requests: any[] }) {
  const completedRequests = requests.filter((r: any) => r.status === 'completed')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Financial Reports</h1>
        <p className="text-gray-600">Revenue and commission overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-4xl font-extrabold">{formatCurrency(stats.revenue)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="text-4xl mb-4">💵</div>
          <h3 className="text-lg font-semibold mb-2">Total Commission</h3>
          <p className="text-4xl font-extrabold">{formatCurrency(stats.commission)}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-8 text-white">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2">Completed Jobs</h3>
          <p className="text-4xl font-extrabold">{stats.completed}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Revenue</th>
                <th className="px-4 py-3 text-left">Commission</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {completedRequests.slice(0, 20).map((request: any) => (
                <tr key={request.requestId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">#{request.requestId}</td>
                  <td className="px-4 py-3">{request.customerName}</td>
                  <td className="px-4 py-3 font-bold text-green-600">
                    {formatCurrency(parseFloat(request.totalCustomerPaid?.toString() || '0'))}
                  </td>
                  <td className="px-4 py-3 font-bold text-purple-600">
                    {formatCurrency(parseFloat(request.totalCommissionEarned?.toString() || '0'))}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(request.completedAt || request.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function RequestDetailsModal({
  request,
  providers,
  onClose,
  onUpdate,
}: {
  request: any
  providers: any[]
  onClose: () => void
  onUpdate: (data: { id: number; data: any }) => void
}) {
  const [status, setStatus] = useState(request.status)
  const [selectedProvider, setSelectedProvider] = useState(request.assignedProviderId || '')

  const handleSave = () => {
    onUpdate({
      id: request.requestId,
      data: {
        status,
        assignedProviderId: selectedProvider ? parseInt(selectedProvider) : null,
      },
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Request #{request.requestId}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name</label>
              <p className="text-gray-900 font-medium">{request.customerName}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <p className="text-gray-900">{request.customerEmail}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
              <p className="text-gray-900">{request.customerPhone}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <p className="text-gray-900">{request.customerAddress}</p>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Selected Items</label>
            <div className="bg-gray-50 rounded-lg p-4">
              {JSON.parse(request.selectedItems || '[]').map((item: any, idx: number) => (
                <div key={idx} className="mb-2">
                  • {item.type} × {item.quantity}
                  {item.is_white && <span className="text-blue-600"> (White)</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Status and Provider */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Provider</label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Provider</option>
                {providers.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - {p.serviceType}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Paid</label>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(parseFloat(request.totalCustomerPaid?.toString() || '0'))}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Provider Payout</label>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(parseFloat(request.totalProviderPayout?.toString() || '0'))}
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Commission</label>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(parseFloat(request.totalCommissionEarned?.toString() || '0'))}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              💾 Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

