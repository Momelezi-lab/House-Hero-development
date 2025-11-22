'use client'

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role?: string
  registered: string
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  
  try {
    const userStr = localStorage.getItem('user')
    if (!userStr) return null
    return JSON.parse(userStr) as User
  } catch {
    return null
  }
}

export function isAdmin(): boolean {
  const user = getUser()
  return user?.role === 'admin' || false
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}

export function logout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('user')
}

