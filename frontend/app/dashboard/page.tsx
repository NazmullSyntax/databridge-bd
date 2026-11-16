"use client"

import { useEffect, useMemo, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"

type DashboardUser = {
  fullName: string
  email: string
  role: string
}

function subscribeToAuthChanges(onChange: () => void) {
  window.addEventListener("storage", onChange)
  return () => window.removeEventListener("storage", onChange)
}

function getAuthSnapshot() {
  return localStorage.getItem("token")
    ? localStorage.getItem("user")
    : null
}

function isDashboardUser(value: unknown): value is DashboardUser {
  if (typeof value !== "object" || value === null) return false

  return (
    "fullName" in value &&
    typeof value.fullName === "string" &&
    "email" in value &&
    typeof value.email === "string" &&
    "role" in value &&
    typeof value.role === "string"
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const userJson = useSyncExternalStore(
    subscribeToAuthChanges,
    getAuthSnapshot,
    () => null,
  )
  const user = useMemo(() => {
    if (!userJson) return null

    try {
      const parsed: unknown = JSON.parse(userJson)
      return isDashboardUser(parsed) ? parsed : null
    } catch {
      return null
    }
  }, [userJson])

  useEffect(() => {
    if (!user) router.push("/login")
  }, [router, user])

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">Customer Dashboard</h1>
        <p className="text-gray-600">Welcome, {user.fullName}!</p>
        <p className="mt-2 text-sm text-gray-500">Email: {user.email}</p>
        <p className="text-sm text-gray-500">Role: {user.role}</p>
      </div>
    </div>
  )
}
