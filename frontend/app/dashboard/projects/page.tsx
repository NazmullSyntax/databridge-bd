"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Project = {
  id: string
  projectCode: string
  title: string
  status: string
  progress: number
  dueDate: string | null
}

export default function CustomerProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchProjects = async () => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

      try {
        const res = await fetch(`${apiUrl}/projects/customer/my`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load projects")
        }
        setProjects(data.data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [router])

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Projects</h1>
          <Link
            href="/dashboard"
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-lg bg-red-50 p-8 text-center text-red-600"
          >
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow">
            No active projects yet. Your projects will appear here once an order
            is confirmed.
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-lg bg-white p-4 shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-gray-500">
                      {project.projectCode}
                    </p>
                  </div>
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                    {project.status}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {project.progress}% complete
                  </p>
                </div>

                {project.dueDate && (
                  <p className="mt-2 text-xs text-gray-500">
                    Due: {new Date(project.dueDate).toLocaleDateString()}
                  </p>
                )}

                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="mt-3 inline-block text-sm text-blue-600 hover:underline"
                >
                  View Details &amp; Deliverables →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
