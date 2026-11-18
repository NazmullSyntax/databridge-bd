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
  assignments: Array<{ user: { fullName: string } }>
}

export default function AdminProjectsPage() {
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
        const res = await fetch(`${apiUrl}/projects`, {
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

  if (loading) return <div className="p-8">Loading...</div>

  if (error) {
    return (
      <div role="alert" className="rounded bg-red-50 p-8 text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">All Projects</h1>
      {projects.length === 0 ? (
        <div className="rounded bg-white p-8 text-center text-gray-500">
          No projects yet.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="rounded bg-white p-4 shadow">
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
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {project.progress}% complete
                </p>
              </div>
              <p className="mt-2 text-sm">
                Team:{" "}
                {project.assignments
                  .map((assignment) => assignment.user.fullName)
                  .join(", ") || "Unassigned"}
              </p>
              <Link
                href={`/admin/projects/${project.id}`}
                className="mt-3 inline-block text-sm text-blue-600 hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
