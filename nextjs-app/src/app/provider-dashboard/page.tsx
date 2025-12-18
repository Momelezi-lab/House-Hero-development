"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceRequestApi, providerApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export default function ProviderDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  // Fetch provider details
  const { data: providerData } = useQuery({
    queryKey: ["provider", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const providers = await providerApi.getAll();
      return providers.find((p: any) => p.email === user.email);
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (providerData) {
      setProvider(providerData);
    }
  }, [providerData]);

  // Fetch available jobs (pending jobs that are not assigned to any provider)
  // Show ALL pending jobs to ALL providers - they can choose which ones to accept
  const { data: availableJobs, isLoading: isLoadingAvailable } = useQuery({
    queryKey: ["available-jobs", provider?.id],
    queryFn: async () => {
      if (!provider?.id) return [];
      const allRequests = await serviceRequestApi.getAll({ status: "pending" });
      // Filter jobs that are not already assigned to any provider
      return allRequests.filter((job: any) => {
        // Only show jobs that are not assigned to any provider
        return !job.assignedProviderId && job.status === "pending";
      });
    },
    enabled: !!provider?.id,
    // Refetch every 5 seconds to get real-time updates
    refetchInterval: 5000,
  });

  // Fetch provider's accepted jobs
  const { data: acceptedJobs, isLoading: isLoadingAccepted } = useQuery({
    queryKey: ["provider-jobs", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const allRequests = await serviceRequestApi.getAll();
      return allRequests.filter((job: any) => job.providerEmail === user.email);
    },
    enabled: !!user?.email,
  });

  // Accept job mutation - uses the atomic accept endpoint
  const acceptJobMutation = useMutation({
    mutationFn: async (requestId: number) => {
      if (!provider?.id) {
        throw new Error("Provider not found");
      }
      // Use the atomic accept endpoint
      const response = await fetch(`/api/service-requests/${requestId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId: provider.id }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to accept booking");
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ["available-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["provider-jobs"] });
    },
    onError: (error: any) => {
      console.error("Accept job error:", error);
      // Show error message to user
      alert(error.message || "Failed to accept booking. It may have been accepted by another provider.");
    },
  });

  // Calculate revenue and next payout
  const calculateStats = () => {
    if (!acceptedJobs)
      return { totalRevenue: 0, nextPayout: null, completedJobs: 0 };

    const completedJobs = acceptedJobs.filter(
      (job: any) => job.status === "completed" || job.status === "confirmed"
    );

    const totalRevenue = completedJobs.reduce((sum: number, job: any) => {
      return sum + (job.totalProviderPayout || 0);
    }, 0);

    // Calculate next weekly payout (every Monday)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7 || 7;
    const nextPayout = new Date(today);
    nextPayout.setDate(today.getDate() + daysUntilMonday);
    nextPayout.setHours(0, 0, 0, 0);

    return { totalRevenue, nextPayout, completedJobs: completedJobs.length };
  };

  const { totalRevenue, nextPayout, completedJobs } = calculateStats();

  const formatDate = (date: string | Date) => {
    if (!date) return "N/A";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    if (!time) return "N/A";
    return time.substring(0, 5); // HH:MM format
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Please log in to view your dashboard
          </p>
          <Link
            href="/login"
            className="inline-block bg-[#2563EB] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1E40AF] transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== "provider") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            This page is only for service providers
          </p>
          <Link
            href="/profile"
            className="inline-block bg-[#2563EB] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1E40AF] transition-all"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#2563EB] text-white py-12 px-4 shadow-2xl">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 font-semibold"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
            Provider Dashboard
          </h1>
          <p className="text-xl text-white/90">
            {provider?.name || user.name} -{" "}
            {provider?.serviceType || "Service Provider"}
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-2xl p-6 text-white shadow-xl">
            <h3 className="text-sm font-semibold text-white/90 mb-2">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
            <p className="text-sm text-white/80 mt-2">
              {completedJobs} completed jobs
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl p-6 text-white shadow-xl">
            <h3 className="text-sm font-semibold text-white/90 mb-2">
              Next Weekly Payout
            </h3>
            <p className="text-3xl font-bold">
              {nextPayout ? formatDate(nextPayout) : "N/A"}
            </p>
            <p className="text-sm text-white/80 mt-2">
              {nextPayout
                ? `${Math.ceil(
                    (nextPayout.getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )} days`
                : ""}
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl p-6 text-white shadow-xl">
            <h3 className="text-sm font-semibold text-white/90 mb-2">
              Active Jobs
            </h3>
            <p className="text-3xl font-bold">
              {acceptedJobs?.filter(
                (j: any) =>
                  j.status === "confirmed" || j.status === "in_progress"
              ).length || 0}
            </p>
            <p className="text-sm text-white/80 mt-2">In progress</p>
          </div>
        </div>

        {/* Available Jobs Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Available Jobs
          </h2>
          {isLoadingAvailable ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b border-[#2563EB] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading available jobs...</p>
            </div>
          ) : availableJobs && availableJobs.length > 0 ? (
            <div className="space-y-4">
              {availableJobs.map((job: any) => (
                <div
                  key={job.requestId}
                  className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Request #{job.requestId}
                      </h3>
                      <p className="text-gray-600">
                        {formatDate(job.preferredDate)} at{" "}
                        {formatTime(job.preferredTime)}
                      </p>
                    </div>
                    <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold border-2 border-yellow-200">
                      Pending
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Customer</p>
                      <p className="font-semibold text-gray-900">
                        {job.customerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {job.customerPhone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Address</p>
                      <p className="font-semibold text-gray-900">
                        {job.customerAddress}
                      </p>
                      {job.unitNumber && (
                        <p className="text-sm text-gray-600">
                          Unit {job.unitNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Your Payout</p>
                      <p className="text-2xl font-bold text-[#10B981]">
                        {formatCurrency(job.totalProviderPayout || 0)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Accept Request #${job.requestId}?\n\nYou will be assigned to this job and it will be removed from other providers' dashboards.`)) {
                          acceptJobMutation.mutate(job.requestId);
                        }
                      }}
                      disabled={acceptJobMutation.isPending}
                      className="bg-[#2563EB] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1E40AF] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      {acceptJobMutation.isPending
                        ? "Accepting..."
                        : "✓ Accept Job"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600 text-lg font-semibold">No available jobs at the moment</p>
              <p className="text-sm text-gray-500 mt-2">
                New service requests will appear here automatically. This page refreshes every 5 seconds.
              </p>
            </div>
          )}
        </div>

        {/* Accepted Jobs Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            My Accepted Jobs
          </h2>
          {isLoadingAccepted ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b border-[#2563EB] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your jobs...</p>
            </div>
          ) : acceptedJobs && acceptedJobs.length > 0 ? (
            <div className="space-y-4">
              {acceptedJobs.map((job: any) => (
                <div
                  key={job.requestId}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Request #{job.requestId}
                      </h3>
                      <p className="text-gray-600">
                        {formatDate(job.preferredDate)} at{" "}
                        {formatTime(job.preferredTime)}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${
                        job.status === "completed"
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]"
                          : job.status === "confirmed"
                          ? "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                      }`}
                    >
                      {job.status?.charAt(0).toUpperCase() +
                        job.status?.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Customer</p>
                      <p className="font-semibold text-gray-900">
                        {job.customerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {job.customerPhone}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Address</p>
                      <p className="font-semibold text-gray-900">
                        {job.customerAddress}
                      </p>
                      {job.unitNumber && (
                        <p className="text-sm text-gray-600">
                          Unit {job.unitNumber}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Your Payout</p>
                    <p className="text-2xl font-bold text-[#10B981]">
                      {formatCurrency(job.totalProviderPayout || 0)}
                    </p>
                  </div>

                  {job.additionalNotes && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Notes</p>
                      <p className="text-gray-900">{job.additionalNotes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-600">You haven't accepted any jobs yet</p>
              <p className="text-sm text-gray-500 mt-2">
                Accept jobs from the available jobs section above
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
