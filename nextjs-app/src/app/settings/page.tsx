'use client'

import Link from 'next/link'

export default function SettingsPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Settings</h1>
          <p className="text-xl text-blue-100">Customize your preferences</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700 font-medium">Email Notifications</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700 font-medium">SMS Notifications</span>
                  <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                </label>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Preferences</h3>
              <div className="space-y-3">
                <label className="block">
                  <span className="text-gray-700 font-medium mb-2 block">Language</span>
                  <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500">
                    <option>English</option>
                    <option>Afrikaans</option>
                    <option>Zulu</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

