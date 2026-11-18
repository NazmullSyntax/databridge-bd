"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Stats = {
  requests: number
  projects: number
  members: number
  submissions: number
}

type Project = {
  id: string
}

type CustomerRequest = {
  id: string
  requestNumber: string
  title: string
  status: string
  createdAt: string
  customer: { fullName: string; email: string }
}

type StatCardProps = {
  label: string
  value: number
  icon: string
  color: "blue" | "green" | "purple" | "orange"
}

const statColors: Record<StatCardProps["color"], string> = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-green-50 text-green-700",
  purple: "bg-purple-50 text-purple-700",
  orange: "bg-orange-50 text-orange-700",
}

export default function AdminOverview() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    requests: 0,
    projects: 0,
    members: 0,
    submissions: 0,
  })
  const [requests, setRequests] = useState<CustomerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      throw new Error("Please sign in to view the admin overview.")
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    const [reqRes, projRes, teamRes] = await Promise.all([
      fetch(`${apiUrl}/admin/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${apiUrl}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${apiUrl}/admin/team`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
    const [reqData, projData, teamData] = await Promise.all([
      reqRes.json(),
      projRes.json(),
      teamRes.json(),
    ])

    if (!reqRes.ok || !reqData.success) {
      throw new Error(reqData.message || "Failed to load requests")
    }
    if (!projRes.ok || !projData.success) {
      throw new Error(projData.message || "Failed to load projects")
    }
    if (!teamRes.ok || !teamData.success) {
      throw new Error(teamData.message || "Failed to load team members")
    }
    if (
      !Array.isArray(reqData.data) ||
      !Array.isArray(projData.data) ||
      !Array.isArray(teamData.data)
    ) {
      throw new Error("Admin overview response was invalid")
    }

    const projects = projData.data as Project[]
    const submissionCounts = await Promise.all(
      projects.map(async (project) => {
        const res = await fetch(
          `${apiUrl}/submissions/project/${project.id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        const data = await res.json()
        if (!res.ok || !data.success || !Array.isArray(data.data)) {
          throw new Error(data.message || "Failed to load submissions")
        }
        return data.data.length
      }),
    )

    setRequests(reqData.data)
    setStats({
      requests: reqData.data.length,
      projects: projects.length,
      members: teamData.data.length,
      submissions: submissionCounts.reduce((total, count) => total + count, 0),
    })
  }, [router])

  const loadStats = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      await fetchStats()
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load admin overview",
      )
    } finally {
      setLoading(false)
    }
  }, [fetchStats])

  useEffect(() => {
    void loadStats()
  }, [loadStats])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold text-slate-900">
        Admin Overview 👑
      </h1>
      <p className="mb-8 text-slate-500">Monitor your business at a glance.</p>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center justify-between rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void loadStats()}
            className="font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Requests" value={stats.requests} icon="📝" color="blue" />
        <StatCard
          label="Projects"
          value={stats.projects}
          icon="📁"
          color="green"
        />
        <StatCard
          label="Team Members"
          value={stats.members}
          icon="👥"
          color="purple"
        />
        <StatCard
          label="Submissions"
          value={stats.submissions}
          icon="📤"
          color="orange"
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/team"
              className="block rounded-lg bg-slate-50 p-3 hover:bg-slate-100"
            >
              + Add Team Member
            </Link>
            <Link
              href="/admin/teams"
              className="block rounded-lg bg-slate-50 p-3 hover:bg-slate-100"
            >
              + Create Team
            </Link>
            <Link
              href="/admin/tasks/new"
              className="block rounded-lg bg-slate-50 p-3 hover:bg-slate-100"
            >
              + Create Task
            </Link>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Recent Activity</h2>
          <p className="text-sm text-slate-500">
            Coming soon: activity feed.
          </p>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-slate-900">
          Customer Requests
        </h2>
        {requests.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
            No requests yet.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded border-l-4 border-blue-500 bg-white p-4 shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{request.title}</h3>
                    <p className="text-sm text-slate-600">
                      {request.requestNumber} · By {request.customer.fullName} (
                      {request.customer.email})
                    </p>
                  </div>
                  <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
                    {request.status}
                  </span>
                </div>
                <Link
                  href={`/admin/requests/${request.id}`}
                  className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                >
                  View &amp; Send Quotation →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${statColors[color]}`}
      >
        {icon}
      </div>
    </div>
  )
}
