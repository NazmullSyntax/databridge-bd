"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

type Deliverable = {
  id: string
  title: string
  description: string | null
  fileUrl: string
  fileType: string
  isFinal: boolean
  uploadedAt: string
}

type Project = {
  id: string
  projectCode: string
  title: string
  status: string
  progress: number
  dueDate: string | null
  deliverables: Deliverable[]
  assignments: Array<{ user: { fullName: string } }>
}

export default function CustomerProjectDetail() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchProject = async () => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

      try {
        const res = await fetch(
          `${apiUrl}/projects/customer/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load project")
        }
        setProject(data.data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id, router])

  if (loading) return <div className="p-8 text-center">Loading...</div>

  if (error || !project) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <p role="alert" className="mb-4 text-red-600">
          {error || "Project not found."}
        </p>
        <Link
          href="/dashboard/projects"
          className="text-sm text-blue-600 hover:underline"
        >
          ← My Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/projects"
          className="mb-4 inline-block text-sm text-blue-600 hover:underline"
        >
          ← My Projects
        </Link>
        <h1 className="mb-2 text-2xl font-bold">{project.title}</h1>
        <p className="mb-6 text-sm text-gray-500">
          {project.projectCode} • Due:{" "}
          {project.dueDate
            ? new Date(project.dueDate).toLocaleDateString()
            : "N/A"}
        </p>

        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 font-semibold">Project Progress</h2>
          <div className="h-3 rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-green-600 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {project.progress}% complete
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Status: {project.status}
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 font-semibold">Assigned Team</h2>
          <p className="text-sm text-gray-600">
            {project.assignments
              .map((assignment) => assignment.user.fullName)
              .join(", ") || "Not assigned yet"}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-3 font-semibold">Deliverables</h2>
          {project.deliverables.length === 0 ? (
            <p className="text-sm text-gray-500">
              No deliverables uploaded yet. Please wait for the team to complete
              the work.
            </p>
          ) : (
            <div className="space-y-3">
              {project.deliverables.map((deliverable) => (
                <div key={deliverable.id} className="rounded border p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{deliverable.title}</h3>
                      {deliverable.description && (
                        <p className="text-sm text-gray-600">
                          {deliverable.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        {deliverable.fileType} •{" "}
                        {new Date(
                          deliverable.uploadedAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {deliverable.isFinal && (
                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                          Final
                        </span>
                      )}
                      <a
                        href={deliverable.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Download ↓
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
