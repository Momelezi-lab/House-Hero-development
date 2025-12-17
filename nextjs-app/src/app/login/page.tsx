"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import Link from "next/link";
import { Logo } from "@/components/Logo";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"login" | "provider-signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // Provider signup form state
  const [providerFormData, setProviderFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    password: "",
    phone: "",
    serviceType: "",
    address: "",
    experienceYears: "",
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log("Login success, user data:", data.user);
      // Store user data
      localStorage.setItem("user", JSON.stringify(data.user));

      // Trigger storage event to update navigation
      window.dispatchEvent(new Event("storage"));

      // Check user role
      const userRole = data.user?.role;
      const isAdminUser = userRole === "admin";
      const isProvider = userRole === "provider";
      console.log("User role:", userRole);
      const redirectTo = searchParams.get("redirect");

      // Redirect based on role or redirect parameter
      if (redirectTo && isAdminUser) {
        console.log("Redirecting to:", redirectTo);
        router.push(redirectTo);
      } else if (isAdminUser) {
        console.log("Redirecting to admin dashboard");
        router.push("/admin");
      } else if (isProvider) {
        console.log("Redirecting to provider dashboard");
        router.push("/provider-dashboard");
      } else {
        console.log("Redirecting to home page");
        router.push("/");
      }
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      setError(error.response?.data?.error || "Login failed");
    },
  });

  const providerSignupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      console.log("Provider signup success:", data);
      // Store user data
      localStorage.setItem("user", JSON.stringify(data.user));
      // Trigger storage event to update navigation
      window.dispatchEvent(new Event("storage"));
      // Redirect to provider dashboard
      router.push("/provider-dashboard");
    },
    onError: (error: any) => {
      console.error("Provider signup error:", error);
      setError(error.response?.data?.error || "Signup failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  const handleProviderSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!providerFormData.serviceType) {
      setError("Please select a service type");
      return;
    }
    
    providerSignupMutation.mutate({
      name: providerFormData.name,
      businessName: providerFormData.businessName,
      email: providerFormData.email,
      password: providerFormData.password,
      phone: providerFormData.phone,
      userType: "provider",
      serviceType: providerFormData.serviceType,
      address: providerFormData.address,
      experienceYears: providerFormData.experienceYears,
    });
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProviderFormData({ ...providerFormData, [e.target.name]: e.target.value });
  };

  const serviceTypes = [
    "Cleaning",
    "Plumbing",
    "Electrical",
    "Handyman",
    "Gardening",
    "Pest Control",
    "Locksmith",
    "Mechanic",
    "Air Conditioning",
    "Sneaker Cleaning",
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-4xl font-extrabold text-[#111827] mb-2">
              {activeTab === "login" ? "Welcome Back" : "Become a Provider"}
            </h1>
            <p className="text-[#6B7280]">
              {activeTab === "login"
                ? "Sign in to your HomeSwift account"
                : "Join HomeSwift as a service provider"}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                activeTab === "login"
                  ? "bg-white text-[#2563EB] shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("provider-signup");
                setError("");
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                activeTab === "provider-signup"
                  ? "bg-white text-[#2563EB] shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Provider Sign Up
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-[#2563EB] text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-[#1E40AF] hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none"
              >
                {loginMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          )}

          {/* Provider Signup Form */}
          {activeTab === "provider-signup" && (
            <form onSubmit={handleProviderSignup} className="space-y-5">
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={providerFormData.name}
                  onChange={handleProviderChange}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={providerFormData.businessName}
                  onChange={handleProviderChange}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="ABC Cleaning Services"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={providerFormData.email}
                  onChange={handleProviderChange}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={providerFormData.phone}
                  onChange={handleProviderChange}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="0#########"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  value={providerFormData.serviceType}
                  onChange={handleProviderChange}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] bg-white"
                >
                  <option value="">Select a service type</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={providerFormData.address}
                  onChange={handleProviderChange}
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="Your business address"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">
                  Years of Experience
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={providerFormData.experienceYears}
                  onChange={handleProviderChange}
                  min="0"
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#111827] mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={providerFormData.password}
                  onChange={handleProviderChange}
                  required
                  className="w-full px-4 py-3 border border-[#D1D5DB] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all text-[#111827] placeholder-[#9CA3AF]"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={providerSignupMutation.isPending}
                className="w-full bg-[#10B981] text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-[#059669] hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none"
              >
                {providerSignupMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating account...
                  </span>
                ) : (
                  "Sign Up as Provider"
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            {activeTab === "login" && (
              <>
                <p className="text-[#6B7280]">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-[#2563EB] font-bold hover:underline"
                  >
                    Sign up as customer
                  </Link>
                </p>
                <p className="text-[#6B7280] mt-2">
                  Are you a service provider?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("provider-signup");
                      setError("");
                    }}
                    className="text-[#10B981] font-bold hover:underline"
                  >
                    Sign up here
                  </button>
                </p>
              </>
            )}
            {activeTab === "provider-signup" && (
              <p className="text-[#6B7280]">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setError("");
                  }}
                  className="text-[#2563EB] font-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
            <Link
              href="/"
              className="mt-4 inline-block text-[#6B7280] hover:text-[#111827] font-semibold"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Loading...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
