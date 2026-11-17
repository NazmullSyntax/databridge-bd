"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type User = {
  id: string
  email: string
  fullName: string
  role: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const verifyToken = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()

        if (!data.success) {
          throw new Error("Invalid token")
        }

        setUser(data.data)
      } catch {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [router])

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">Customer Dashboard</h1>
        <p className="text-gray-600">Welcome, {user.fullName}!</p>
        <p className="mt-2 text-sm text-gray-500">Email: {user.email}</p>
        <p className="text-sm text-gray-500">Role: {user.role}</p>

        <Button
          render={<Link href="/dashboard/requests" />}
          className="mt-4"
        >
          My Requests
        </Button>

        <button
          onClick={() => {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            router.push("/login")
          }}
          className="mt-6 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
