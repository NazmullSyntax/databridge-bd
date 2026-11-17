"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Request = {
  id: string
  requestNumber: string
  title: string
  status: string
  createdAt: string
  customer: { fullName: string; email: string }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem("token")
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

      try {
        const res = await fetch(`${apiUrl}/admin/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setRequests(data.data)
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">All Customer Requests</h2>
      {requests.length === 0 ? (
        <div className="rounded bg-white p-8 text-center text-gray-500">
          No requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="rounded border-l-4 border-blue-500 bg-white p-4 shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{req.title}</h3>
                  <p className="text-sm text-gray-600">
                    {req.requestNumber} • By {req.customer.fullName} (
                    {req.customer.email})
                  </p>
                </div>
                <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                  {req.status}
                </span>
              </div>
              <Link
                href={`/admin/requests/${req.id}`}
                className="mt-2 inline-block text-sm text-blue-600 hover:underline"
              >
                View & Send Quotation →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
