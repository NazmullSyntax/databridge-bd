"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Member = {
  id: string
  fullName: string
  email: string
  phone: string | null
  isActive: boolean
}

type MemberForm = {
  email: string
  fullName: string
  phone: string
  designation: string
  department: string
}

type StatusMessage = {
  text: string
  success: boolean
}

const emptyForm: MemberForm = {
  email: "",
  fullName: "",
  phone: "",
  designation: "",
  department: "",
}

export default function AdminTeamPage() {
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<MemberForm>(emptyForm)
  const [message, setMessage] = useState<StatusMessage | null>(null)
  const [error, setError] = useState("")
  const [temporaryPassword, setTemporaryPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [togglingMemberId, setTogglingMemberId] = useState<string | null>(null)

  const fetchMembers = useCallback(async (): Promise<Member[]> => {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Please sign in to manage team members.")
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

    const res = await fetch(`${apiUrl}/admin/team`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to load team members")
    }
    if (!Array.isArray(data.data)) {
      throw new Error("Team members response was invalid")
    }
    return data.data
  }, [])

  useEffect(() => {
    let active = true

    fetchMembers()
      .then((data) => {
        if (active) {
          setMembers(data)
          setError("")
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Failed to load team members",
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [fetchMembers])

  const handleCreateMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setTemporaryPassword("")

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setSubmitting(true)

    try {
      const res = await fetch(`${apiUrl}/admin/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create team member")
      }

      setMessage({
        text: data.message || "Team member created.",
        success: true,
      })
      if (typeof data.data?.temporaryPassword === "string") {
        setTemporaryPassword(data.data.temporaryPassword)
      }
      setForm(emptyForm)
      setShowForm(false)
      try {
        setMembers(await fetchMembers())
        setError("")
      } catch {
        setError("Member created, but the team list could not be refreshed.")
      }
    } catch (err: unknown) {
      setMessage({
        text:
          err instanceof Error ? err.message : "Failed to create team member",
        success: false,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggle = async (id: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setMessage(null)
    setTogglingMemberId(id)

    try {
      const res = await fetch(`${apiUrl}/admin/members/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update team member")
      }

      setMessage({ text: "Member status updated.", success: true })
      try {
        setMembers(await fetchMembers())
        setError("")
      } catch {
        setError("Status updated, but the team list could not be refreshed.")
      }
    } catch (err: unknown) {
      setMessage({
        text:
          err instanceof Error ? err.message : "Failed to update team member",
        success: false,
      })
    } finally {
      setTogglingMemberId(null)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "+ Add Member"}
        </button>
      </div>

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

      {temporaryPassword && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            Temporary password — share securely:
          </p>
          <code className="mt-1 block select-all text-sm text-amber-900">
            {temporaryPassword}
          </code>
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
          <h2 className="mb-4 font-semibold">Create New Member</h2>
          <form
            onSubmit={handleCreateMember}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <input
              required
              type="text"
              autoComplete="name"
              placeholder="Full Name"
              className="rounded-lg border px-3 py-2"
              value={form.fullName}
              onChange={(event) =>
                setForm({ ...form, fullName: event.target.value })
              }
            />
            <input
              required
              type="email"
              autoComplete="email"
              placeholder="Email"
              className="rounded-lg border px-3 py-2"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
            />
            <input
              type="tel"
              autoComplete="tel"
              placeholder="Phone"
              className="rounded-lg border px-3 py-2"
              value={form.phone}
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
            />
            <input
              type="text"
              placeholder="Designation"
              className="rounded-lg border px-3 py-2"
              value={form.designation}
              onChange={(event) =>
                setForm({ ...form, designation: event.target.value })
              }
            />
            <input
              type="text"
              placeholder="Department"
              className="rounded-lg border px-3 py-2 md:col-span-2"
              value={form.department}
              onChange={(event) =>
                setForm({ ...form, department: event.target.value })
              }
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50 md:col-span-2"
            >
              {submitting ? "Creating..." : "Create Member"}
            </button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-600">Name</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Email</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {member.fullName}
                </td>
                <td className="px-6 py-4 text-slate-600">{member.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      member.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {member.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/team/${member.id}`}
                    className="mr-3 text-sm text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    disabled={togglingMemberId !== null}
                    onClick={() => handleToggle(member.id)}
                    className="text-sm text-blue-600 hover:underline disabled:opacity-50"
                  >
                    {togglingMemberId === member.id
                      ? "Updating..."
                      : member.isActive
                        ? "Deactivate"
                        : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  No team members yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
