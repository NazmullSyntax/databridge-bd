"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Team = {
  id: string
  name: string
  description: string | null
  department: string | null
  leader: { fullName: string; email: string } | null
  members: Array<{ user: { fullName: string; email: string } }>
}

type TeamForm = {
  name: string
  description: string
  department: string
}

const emptyForm: TeamForm = { name: "", description: "", department: "" }

export default function AdminTeamsPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<TeamForm>(emptyForm)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const fetchTeams = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    const res = await fetch(`${apiUrl}/teams`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to load teams")
    }
    if (!Array.isArray(data.data)) {
      throw new Error("Teams response was invalid")
    }
    setTeams(data.data)
  }, [router])

  useEffect(() => {
    let active = true

    fetchTeams()
      .then(() => {
        if (active) setError("")
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load teams")
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [fetchTeams])

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
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
      const res = await fetch(`${apiUrl}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create team")
      }

      setMessage("Team created!")
      setForm(emptyForm)
      setShowForm(false)
      try {
        await fetchTeams()
      } catch {
        setError("Team created, but the team list could not be refreshed.")
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create team",
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teams</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ Create Team"}
        </button>
      </div>

      {message && (
        <div
          role="status"
          className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          {message}
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

      {showForm && (
        <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Create New Team</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              required
              placeholder="Team Name"
              className="w-full rounded-lg border px-3 py-2"
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
            />
            <input
              placeholder="Department"
              className="w-full rounded-lg border px-3 py-2"
              value={form.department}
              onChange={(event) =>
                setForm({ ...form, department: event.target.value })
              }
            />
            <textarea
              placeholder="Description"
              rows={2}
              className="w-full rounded-lg border px-3 py-2"
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Create Team"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {teams.length === 0 ? (
          <div className="col-span-2 rounded-xl bg-white p-8 text-center text-slate-500 shadow">
            No teams yet. Click "Create Team" to get started.
          </div>
        ) : (
          teams.map((team) => (
            <div
              key={team.id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="text-lg font-semibold">{team.name}</h3>
                <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                  {team.department || "General"}
                </span>
              </div>
              <p className="mb-3 text-sm text-slate-600">
                {team.description || "No description"}
              </p>
              <p className="mb-2 text-sm text-slate-500">
                <strong>Leader:</strong>{" "}
                {team.leader?.fullName || "Not assigned"}
              </p>
              <p className="mb-3 text-sm text-slate-500">
                <strong>Members:</strong> {team.members.length}
              </p>
              <Link
                href={`/admin/teams/${team.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Manage Team →
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
