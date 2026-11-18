"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

type ProjectOption = {
  id: string
  title: string
  projectCode: string
}

type TeamMemberOption = {
  id: string
  fullName: string
}

type TaskForm = {
  projectId: string
  title: string
  description: string
  assignedTo: string
  dueDate: string
  priority: string
}

type StatusMessage = {
  text: string
  success: boolean
}

const emptyForm: TaskForm = {
  projectId: "",
  title: "",
  description: "",
  assignedTo: "",
  dueDate: "",
  priority: "MEDIUM",
}

export default function NewTaskPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectOption[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMemberOption[]>([])
  const [form, setForm] = useState<TaskForm>(emptyForm)
  const [message, setMessage] = useState<StatusMessage | null>(null)
  const [error, setError] = useState("")
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true

    const fetchOptions = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        throw new Error("Please sign in to create a task.")
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      const [projectsRes, teamRes] = await Promise.all([
        fetch(`${apiUrl}/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${apiUrl}/admin/team`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      const [projectsData, teamData] = await Promise.all([
        projectsRes.json(),
        teamRes.json(),
      ])

      if (!projectsRes.ok || !projectsData.success) {
        throw new Error(projectsData.message || "Failed to load projects")
      }
      if (!teamRes.ok || !teamData.success) {
        throw new Error(teamData.message || "Failed to load team members")
      }
      if (!Array.isArray(projectsData.data) || !Array.isArray(teamData.data)) {
        throw new Error("Task form options response was invalid")
      }

      if (active) {
        setProjects(projectsData.data)
        setTeamMembers(teamData.data)
      }
    }

    fetchOptions()
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load task form options",
          )
        }
      })
      .finally(() => {
        if (active) setOptionsLoading(false)
      })

    return () => {
      active = false
    }
  }, [router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setError("")

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setSubmitting(true)

    try {
      const res = await fetch(`${apiUrl}/tasks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create task")
      }

      setMessage({ text: "Task created successfully!", success: true })
      setTimeout(() => router.push("/admin/projects"), 1500)
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : "Failed to create task",
        success: false,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Create New Task</h1>

      {message && (
        <div
          role={message.success ? "status" : "alert"}
          className={`mb-4 rounded-lg p-3 text-sm ${
            message.success
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label htmlFor="task-project" className="mb-1 block text-sm font-medium">
            Project *
          </label>
          <select
            id="task-project"
            required
            className="w-full rounded-lg border px-3 py-2"
            value={form.projectId}
            onChange={(event) =>
              setForm({ ...form, projectId: event.target.value })
            }
            disabled={optionsLoading || submitting}
          >
            <option value="">
              {optionsLoading ? "Loading projects..." : "Select a project"}
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title} ({project.projectCode})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="task-title" className="mb-1 block text-sm font-medium">
            Task Title *
          </label>
          <input
            id="task-title"
            required
            className="w-full rounded-lg border px-3 py-2"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            disabled={submitting}
          />
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="mb-1 block text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id="task-description"
            rows={3}
            className="w-full rounded-lg border px-3 py-2"
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            disabled={submitting}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="task-assignee"
              className="mb-1 block text-sm font-medium"
            >
              Assign To *
            </label>
            <select
              id="task-assignee"
              required
              className="w-full rounded-lg border px-3 py-2"
              value={form.assignedTo}
              onChange={(event) =>
                setForm({ ...form, assignedTo: event.target.value })
              }
              disabled={optionsLoading || submitting}
            >
              <option value="">
                {optionsLoading ? "Loading members..." : "Select member"}
              </option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.fullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="task-priority"
              className="mb-1 block text-sm font-medium"
            >
              Priority
            </label>
            <select
              id="task-priority"
              className="w-full rounded-lg border px-3 py-2"
              value={form.priority}
              onChange={(event) =>
                setForm({ ...form, priority: event.target.value })
              }
              disabled={submitting}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Priority is not currently saved by the backend.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="task-due-date"
            className="mb-1 block text-sm font-medium"
          >
            Due Date *
          </label>
          <input
            id="task-due-date"
            type="date"
            required
            className="w-full rounded-lg border px-3 py-2"
            value={form.dueDate}
            onChange={(event) =>
              setForm({ ...form, dueDate: event.target.value })
            }
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || optionsLoading || Boolean(error)}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  )
}
