"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type DashboardUser = {
  fullName: string
}

type DashboardStats = {
  requests: number
  projects: number
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    requests: 0,
    projects: 0,
  })
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const parsedUser: unknown = JSON.parse(userStr)
        if (
          typeof parsedUser === "object" &&
          parsedUser !== null &&
          "fullName" in parsedUser &&
          typeof parsedUser.fullName === "string"
        ) {
          setUser({ fullName: parsedUser.fullName })
        }
      } catch {
        setError("Could not read the signed-in user.")
      }
    }

    const token = localStorage.getItem("token")
    if (!token) {
      setError("Please sign in to view your dashboard.")
      setLoading(false)
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

    const fetchStats = async () => {
      try {
        const [requestRes, projectRes] = await Promise.all([
          fetch(`${apiUrl}/requests/my`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiUrl}/projects/customer/my`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        const [requestData, projectData] = await Promise.all([
          requestRes.json(),
          projectRes.json(),
        ])

        if (!requestRes.ok || !requestData.success) {
          throw new Error(requestData.message || "Failed to load requests")
        }
        if (!projectRes.ok || !projectData.success) {
          throw new Error(projectData.message || "Failed to load projects")
        }
        if (
          !Array.isArray(requestData.data) ||
          !Array.isArray(projectData.data)
        ) {
          throw new Error("The dashboard returned invalid statistics.")
        }

        setStats({
          requests: requestData.data.length,
          projects: projectData.data.length,
        })
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard statistics",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const firstName = user?.fullName.split(" ")[0] || "User"

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        Welcome back, {firstName}! 👋
      </h1>
      <p className="mb-8 text-slate-500">
        Here is what&apos;s happening with your projects today.
      </p>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Requests
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {loading ? "…" : stats.requests}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl">
              📝
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active Projects
              </p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {loading ? "…" : stats.projects}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-2xl">
              📁
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-slate-900">
          Need more data?
        </h2>
        <p className="mb-4 text-slate-500">
          Submit a new request and our team will get back to you.
        </p>
        <Link
          href="/dashboard/requests/new"
          className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          + New Data Request
        </Link>
      </div>
    </div>
  )
}
