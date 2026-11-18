"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import ProjectChat from "@/components/ProjectChat"

type User = {
  id: string
  fullName: string
  email: string
  phone: string | null
}

type ProjectDetail = {
  id: string
  projectCode: string
  title: string
  status: string
  progress: number
  dueDate: string | null
  startDate: string | null
  order: {
    customerId: string
    totalAmount: string
    quotation: {
      request: {
        title: string
        objective: string
        dataCategory: string
        targetLocation: string
        customer: {
          fullName: string
          email: string
          phone: string | null
        }
      }
    }
  }
  assignments: Array<{ user: User }>
  deliverables: Array<{
    id: string
    title: string
    fileUrl: string
    fileType: string
  }>
}

const projectStatuses = [
  "RESEARCH_PLANNING",
  "DATA_COLLECTION",
  "DATA_VERIFICATION",
  "DATA_CLEANING",
  "COMPLETED",
]

export default function AdminProjectDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [updateForm, setUpdateForm] = useState({
    status: "",
    progress: "0",
    dueDate: "",
  })

  const fetchProject = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      throw new Error("Please sign in to manage projects.")
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    const [projectRes, usersRes] = await Promise.all([
      fetch(`${apiUrl}/projects/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${apiUrl}/admin/users/team`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
    const [projectData, usersData] = await Promise.all([
      projectRes.json(),
      usersRes.json(),
    ])

    if (!projectRes.ok || !projectData.success) {
      throw new Error(projectData.message || "Failed to load project")
    }
    if (!usersRes.ok || !usersData.success) {
      throw new Error(usersData.message || "Failed to load team members")
    }
    if (!Array.isArray(usersData.data)) {
      throw new Error("Team members response was invalid")
    }

    const detail = projectData.data as ProjectDetail
    setProject(detail)
    setTeamMembers(usersData.data)
    setUpdateForm({
      status: detail.status,
      progress: String(detail.progress),
      dueDate: detail.dueDate ? detail.dueDate.split("T")[0] : "",
    })
  }, [id, router])

  useEffect(() => {
    let active = true

    fetchProject()
      .then(() => {
        if (active) setError("")
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load project")
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [fetchProject])

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setMessage("")

    const progress = Number(updateForm.progress)
    if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
      setError("Progress must be a whole number between 0 and 100.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setUpdating(true)

    try {
      const res = await fetch(`${apiUrl}/projects/admin/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: updateForm.status,
          progress,
          dueDate: updateForm.dueDate || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update project")
      }

      setMessage("Project updated.")
      try {
        await fetchProject()
      } catch {
        setError("Project updated, but the project details could not be refreshed.")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update project")
    } finally {
      setUpdating(false)
    }
  }

  const handleAssign = async () => {
    if (!selectedUser) {
      setError("Select a team member to assign.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setSubmitting(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch(`${apiUrl}/projects/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: id,
          userId: selectedUser,
          role: "RESEARCHER",
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to assign team member")
      }

      setMessage("Team member assigned.")
      setSelectedUser("")
      try {
        await fetchProject()
      } catch {
        setError("Member assigned, but project details could not be refreshed.")
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to assign team member",
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  if (!project) {
    return (
      <div role="alert" className="rounded bg-red-50 p-8 text-red-600">
        {error || "Project not found."}
      </div>
    )
  }

  const assignedUserIds = new Set(
    project.assignments.map((assignment) => assignment.user.id),
  )

  return (
    <div>
      <Link
        href="/admin/projects"
        className="mb-4 inline-block text-sm text-blue-600 hover:underline"
      >
        ← All Projects
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-sm text-slate-500">{project.projectCode}</p>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
          {project.status}
        </span>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      {message && (
        <div
          role="status"
          className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          {message}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold">Customer Info</h2>
          <p className="text-sm">
            <strong>Name:</strong>{" "}
            {project.order.quotation.request.customer.fullName}
          </p>
          <p className="text-sm">
            <strong>Email:</strong>{" "}
            {project.order.quotation.request.customer.email}
          </p>
          <p className="text-sm">
            <strong>Phone:</strong>{" "}
            {project.order.quotation.request.customer.phone || "N/A"}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <h2 className="mb-2 font-semibold">Request Details</h2>
          <p className="text-sm">
            <strong>Request:</strong>{" "}
            {project.order.quotation.request.title}
          </p>
          <p className="text-sm">
            <strong>Objective:</strong>{" "}
            {project.order.quotation.request.objective}
          </p>
          <p className="text-sm">
            <strong>Category:</strong>{" "}
            {project.order.quotation.request.dataCategory}
          </p>
          <p className="text-sm">
            <strong>Location:</strong>{" "}
            {project.order.quotation.request.targetLocation}
          </p>
          <p className="text-sm">
            <strong>Amount:</strong> ৳{project.order.totalAmount}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">Team Assignment</h2>
        {project.assignments.length === 0 ? (
          <p className="text-sm text-slate-500">
            No team members assigned yet.
          </p>
        ) : (
          <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            {project.assignments.map((assignment) => (
              <div
                key={assignment.user.id}
                className="rounded-lg border p-3"
              >
                <p className="font-medium">{assignment.user.fullName}</p>
                <p className="text-xs text-slate-500">
                  {assignment.user.email}
                </p>
                <p className="text-xs text-slate-500">
                  {assignment.user.phone || "No phone"}
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            aria-label="Select team member to assign"
            className="flex-1 rounded-lg border px-3 py-2"
            value={selectedUser}
            onChange={(event) => setSelectedUser(event.target.value)}
            disabled={submitting}
          >
            <option value="">Select team member...</option>
            {teamMembers
              .filter((member) => !assignedUserIds.has(member.id))
              .map((member) => (
                <option key={member.id} value={member.id}>
                  {member.fullName} ({member.email})
                </option>
              ))}
          </select>
          <button
            type="button"
            onClick={handleAssign}
            disabled={!selectedUser || submitting}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Assigning..." : "Assign Member"}
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">Update Project</h2>
        <form onSubmit={handleUpdate} className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label
                htmlFor="project-status"
                className="mb-1 block text-sm"
              >
                Status
              </label>
              <select
                id="project-status"
                className="w-full rounded-lg border px-3 py-2"
                value={updateForm.status}
                onChange={(event) =>
                  setUpdateForm({ ...updateForm, status: event.target.value })
                }
                disabled={updating}
              >
                {!projectStatuses.includes(updateForm.status) && (
                  <option value={updateForm.status}>{updateForm.status}</option>
                )}
                {projectStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="project-progress"
                className="mb-1 block text-sm"
              >
                Progress (%)
              </label>
              <input
                id="project-progress"
                type="number"
                min={0}
                max={100}
                step={1}
                className="w-full rounded-lg border px-3 py-2"
                value={updateForm.progress}
                onChange={(event) =>
                  setUpdateForm({
                    ...updateForm,
                    progress: event.target.value,
                  })
                }
                disabled={updating}
              />
            </div>
            <div>
              <label htmlFor="project-due-date" className="mb-1 block text-sm">
                Due Date
              </label>
              <input
                id="project-due-date"
                type="date"
                className="w-full rounded-lg border px-3 py-2"
                value={updateForm.dueDate}
                onChange={(event) =>
                  setUpdateForm({ ...updateForm, dueDate: event.target.value })
                }
                disabled={updating}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={updating}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Project"}
          </button>
        </form>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold">Deliverables</h2>
        {project.deliverables.length === 0 ? (
          <p className="text-sm text-slate-500">
            No deliverables uploaded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {project.deliverables.map((deliverable) => (
              <div
                key={deliverable.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{deliverable.title}</p>
                  <p className="text-xs text-slate-500">
                    {deliverable.fileType}
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

      <div className="mt-6">
        <ProjectChat projectId={String(id)} />
      </div>
    </div>
  )
}
