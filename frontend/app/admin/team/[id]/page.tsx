"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

type UserDetail = {
  id: string
  fullName: string
  email: string
  phone: string | null
  isActive: boolean
  createdAt: string
  profile: { companyName: string | null; bio: string | null } | null
}

export default function AdminEmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      throw new Error("Please sign in to view team member details.")
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    const res = await fetch(`${apiUrl}/admin/team/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to load team member")
    }

    setUser(data.data)
  }, [id, router])

  useEffect(() => {
    let active = true

    fetchUser()
      .then(() => {
        if (active) setError("")
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load team member",
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [fetchUser])

  if (loading) return <div className="p-8">Loading...</div>

  if (!user) {
    return (
      <div role="alert" className="rounded-lg bg-red-50 p-8 text-red-700">
        {error || "Team member not found"}
      </div>
    )
  }

  return (
    <div>
      <Link
        href="/admin/team"
        className="mb-4 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Team Members
      </Link>
      <h1 className="mb-1 text-2xl font-bold">{user.fullName}</h1>
      <p className="mb-6 text-sm text-slate-500">{user.email}</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold">Contact</h2>
          <p className="text-sm">
            <strong>Phone:</strong> {user.phone || "N/A"}
          </p>
          <p className="text-sm">
            <strong>Joined:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm">
            <strong>Status:</strong>{" "}
            <span className={user.isActive ? "text-green-600" : "text-red-600"}>
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold">Profile</h2>
          <p className="text-sm">
            <strong>Designation:</strong> {user.profile?.bio || "N/A"}
          </p>
          <p className="text-sm">
            <strong>Department:</strong>{" "}
            {user.profile?.companyName || "N/A"}
          </p>
        </div>
      </div>
    </div>
  )
}
