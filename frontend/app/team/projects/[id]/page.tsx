"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  location: string | null
}

type Deliverable = {
  id: string
  title: string
  fileUrl: string
  fileType: string
  uploadedAt: string
}

export default function TeamProjectDetail() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchData = async () => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

      try {
        const [tasksRes, deliverablesRes] = await Promise.all([
          fetch(`${apiUrl}/tasks/project/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiUrl}/deliverables/project/${params.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        const [tasksData, deliverablesData] = await Promise.all([
          tasksRes.json(),
          deliverablesRes.json(),
        ])

        if (!tasksRes.ok || !tasksData.success) {
          throw new Error(tasksData.message || "Failed to load tasks")
        }
        if (!deliverablesRes.ok || !deliverablesData.success) {
          throw new Error(
            deliverablesData.message || "Failed to load deliverables",
          )
        }

        setTasks(tasksData.data)
        setDeliverables(deliverablesData.data)
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load project details",
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  if (loading) return <div className="p-8">Loading...</div>

  if (error) {
    return (
      <div role="alert" className="p-8 text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/team"
          className="mb-4 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Team Dashboard
        </Link>
        <h1 className="mb-6 text-2xl font-bold">
          Project Tasks &amp; Deliverables
        </h1>
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href={`/team/projects/${params.id}/deliverables/new`}
            className="inline-block rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Upload Deliverable
          </Link>
          <Link
            href={`/team/projects/${params.id}/submissions/new`}
            className="inline-block rounded bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            Submit Work
          </Link>
        </div>

        <div className="mb-6 rounded bg-white p-4 shadow">
          <h2 className="mb-3 font-semibold">Field Tasks</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet.</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="rounded border p-3">
                  <h3 className="font-medium">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-gray-600">
                      {task.description}
                    </p>
                  )}
                  {task.location && (
                    <p className="mt-1 text-xs text-gray-500">
                      Location: {task.location}
                    </p>
                  )}
                  <span className="mt-2 inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded bg-white p-4 shadow">
          <h2 className="mb-3 font-semibold">Deliverables</h2>
          {deliverables.length === 0 ? (
            <p className="text-gray-500">No deliverables yet.</p>
          ) : (
            <div className="space-y-2">
              {deliverables.map((deliverable) => (
                <div
                  key={deliverable.id}
                  className="flex items-center justify-between rounded border p-3"
                >
                  <div>
                    <h3 className="font-medium">{deliverable.title}</h3>
                    <p className="text-xs text-gray-500">
                      {deliverable.fileType} ·{" "}
                      {new Date(deliverable.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={deliverable.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
