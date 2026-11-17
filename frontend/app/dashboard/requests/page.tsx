"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

type DataRequest = {
  id: string
  requestNumber: string
  title: string
  status: string
  createdAt: string
}

export default function MyRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<DataRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchRequests = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
        const res = await fetch(`${apiUrl}/requests/my`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load requests")
        }
        setRequests(data.data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load requests")
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [router])

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Data Requests</h1>
          <Button render={<Link href="/dashboard/requests/new" />}>
            + New Request
          </Button>
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-lg bg-red-50 p-8 text-center text-red-600"
          >
            {error}
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow">
            No requests yet. Click &quot;New Request&quot; to get started.
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="rounded-lg border-l-4 border-blue-500 bg-white p-4 shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{req.title}</h3>
                    <p className="text-sm text-gray-500">{req.requestNumber}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          className="mt-6"
          onClick={() => router.push("/dashboard")}
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
