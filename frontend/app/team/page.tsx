"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Project = {
  id: string
  projectCode: string
  title: string
  status: string
  progress: number
  dueDate: string
}

export default function TeamDashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    if (!token || !userStr) {
      router.push("/login")
      return
    }
    const user = JSON.parse(userStr)
    if (user.role !== "TEAM" && user.role !== "ADMIN") {
      router.push("/dashboard")
      return
    }

    const fetchProjects = async () => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      try {
        const res = await fetch(`${apiUrl}/projects/my`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setProjects(data.data)
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [router])

  const handleStatusUpdate = async (projectId: string, status: string) => {
    const token = localStorage.getItem("token")
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    const res = await fetch(`${apiUrl}/projects/${projectId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
        progress: status === "COMPLETED" ? 100 : 50,
      }),
    })
    if (res.ok) {
      alert("Status updated!")
      window.location.reload()
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold">Team Dashboard</h1>
        {projects.length === 0 ? (
          <div className="rounded bg-white p-8 text-center text-gray-500">
            No projects assigned.
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((p) => (
              <div key={p.id} className="rounded bg-white p-4 shadow">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-gray-500">{p.projectCode}</p>
                <p className="text-sm">Status: {p.status}</p>
                <div className="mt-2">
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <select
                    className="rounded border px-2 py-1 text-sm"
                    onChange={(e) => handleStatusUpdate(p.id, e.target.value)}
                  >
                    <option value="">Update status...</option>
                    <option value="DATA_COLLECTION">Data Collection</option>
                    <option value="DATA_VERIFICATION">Data Verification</option>
                    <option value="DATA_CLEANING">Data Cleaning</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
