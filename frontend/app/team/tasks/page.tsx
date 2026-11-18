"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  dueDate: string | null
  project: { title: string; projectCode: string }
}

export default function TeamTasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      throw new Error("Please sign in to view your tasks.")
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    const res = await fetch(`${apiUrl}/tasks/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to load tasks")
    }
    if (!Array.isArray(data.data)) {
      throw new Error("Tasks response was invalid")
    }

    setTasks(data.data)
  }, [router])

  useEffect(() => {
    let active = true

    fetchTasks()
      .then(() => {
        if (active) setError("")
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load tasks")
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [fetchTasks])

  const handleStatusUpdate = async (taskId: string, status: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setUpdatingTaskId(taskId)
    setError("")

    try {
      const res = await fetch(`${apiUrl}/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update task status")
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, status } : task,
        ),
      )
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to update task status",
      )
    } finally {
      setUpdatingTaskId(null)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Tasks</h1>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow">
          No tasks assigned yet.
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">{task.title}</h2>
                  <p className="text-sm text-slate-500">
                    {task.project.title} ({task.project.projectCode})
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    task.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : task.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {task.status}
                </span>
              </div>
              {task.description && (
                <p className="mt-2 text-sm text-slate-600">
                  {task.description}
                </p>
              )}
              {task.dueDate && (
                <p className="mt-2 text-xs text-slate-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                <label htmlFor={`task-status-${task.id}`} className="sr-only">
                  Update status for {task.title}
                </label>
                <select
                  id={`task-status-${task.id}`}
                  className="rounded-lg border px-2 py-1 text-sm"
                  value={task.status}
                  disabled={updatingTaskId !== null}
                  onChange={(event) =>
                    void handleStatusUpdate(task.id, event.target.value)
                  }
                >
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                {updatingTaskId === task.id && (
                  <span className="self-center text-xs text-slate-500">
                    Updating...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
