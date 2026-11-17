"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

type TeamMember = {
  id: string
  fullName: string
  email: string
}

type Project = {
  id: string
  projectCode: string
  title: string
  status: string
  assignments: Array<{ user: TeamMember }>
}

export default function AdminProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [selectedUser, setSelectedUser] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

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
        const [projectsRes, usersRes] = await Promise.all([
          fetch(`${apiUrl}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiUrl}/admin/users/team`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        const [projectsData, usersData] = await Promise.all([
          projectsRes.json(),
          usersRes.json(),
        ])

        if (!projectsRes.ok || !projectsData.success) {
          throw new Error(projectsData.message || "Failed to load project")
        }
        if (!usersRes.ok || !usersData.success) {
          throw new Error(usersData.message || "Failed to load team members")
        }

        const currentProject = (projectsData.data as Project[]).find(
          (item) => item.id === params.id,
        )
        if (!currentProject) {
          throw new Error("Project not found")
        }

        setProject(currentProject)
        setTeamMembers(usersData.data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleAssign = async () => {
    if (!selectedUser || !project) return

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
          projectId: params.id,
          userId: selectedUser,
          role: "RESEARCHER",
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to assign team member")
      }

      const assignedMember = teamMembers.find(
        (member) => member.id === selectedUser,
      )
      if (assignedMember) {
        setProject({
          ...project,
          assignments: [...project.assignments, { user: assignedMember }],
        })
      }
      setSelectedUser("")
      setMessage("Team member assigned.")
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

  if (error && !project) {
    return (
      <div role="alert" className="rounded bg-red-50 p-8 text-red-600">
        {error}
      </div>
    )
  }

  if (!project) {
    return (
      <div role="alert" className="rounded bg-red-50 p-8 text-red-600">
        Project not found.
      </div>
    )
  }

  const assignedUserIds = new Set(
    project.assignments.map((assignment) => assignment.user.id),
  )

  return (
    <div className="p-4">
      <Link
        href="/admin/projects"
        className="mb-4 inline-block text-sm text-blue-600 hover:underline"
      >
        ← All Projects
      </Link>
      <h1 className="mb-4 text-2xl font-bold">{project.title}</h1>
      <p className="mb-2 text-gray-600">{project.projectCode}</p>
      <p className="mb-4">Status: {project.status}</p>

      <div className="mb-4 rounded bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold">Team Members</h2>
        <p>
          {project.assignments
            .map((assignment) => assignment.user.fullName)
            .join(", ") || "None"}
        </p>
      </div>

      <div className="rounded bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold">Assign New Member</h2>
        {message && (
          <p role="status" className="mb-2 text-sm text-green-700">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="mb-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <select
          className="mb-2 w-full rounded border px-3 py-2"
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
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Assigning..." : "Assign"}
        </button>
      </div>
    </div>
  )
}
