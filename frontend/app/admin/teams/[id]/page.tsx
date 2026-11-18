"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

type User = {
  id: string
  fullName: string
  email: string
}

type TeamDetail = {
  id: string
  name: string
  description: string | null
  department: string | null
  leaderId: string | null
  leader: { fullName: string; email: string } | null
  members: Array<{ user: User }>
}

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [team, setTeam] = useState<TeamDetail | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedLeader, setSelectedLeader] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [addingMember, setAddingMember] = useState(false)
  const [settingLeader, setSettingLeader] = useState(false)
  const [removingUserId, setRemovingUserId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      throw new Error("Please sign in to manage teams.")
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    const [teamRes, usersRes] = await Promise.all([
      fetch(`${apiUrl}/teams/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${apiUrl}/admin/team`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
    const [teamData, usersData] = await Promise.all([
      teamRes.json(),
      usersRes.json(),
    ])

    if (!teamRes.ok || !teamData.success) {
      throw new Error(teamData.message || "Failed to load team")
    }
    if (!usersRes.ok || !usersData.success) {
      throw new Error(usersData.message || "Failed to load team members")
    }
    if (!Array.isArray(usersData.data)) {
      throw new Error("Team members response was invalid")
    }

    setTeam(teamData.data)
    setSelectedLeader(teamData.data.leaderId || "")
    setAllUsers(usersData.data)
  }, [id, router])

  useEffect(() => {
    let active = true

    fetchData()
      .then(() => {
        if (active) setError("")
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load team")
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [fetchData])

  const handleAddMember = async () => {
    if (!selectedUser) {
      setError("Select a member to add.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setAddingMember(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch(`${apiUrl}/teams/add-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          teamId: id,
          userId: selectedUser,
          role: "MEMBER",
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add member")
      }

      setMessage("Member added.")
      setSelectedUser("")
      try {
        await fetchData()
      } catch {
        setError("Member added, but the team details could not be refreshed.")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add member")
    } finally {
      setAddingMember(false)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setRemovingUserId(userId)
    setError("")
    setMessage("")

    try {
      const res = await fetch(`${apiUrl}/teams/${id}/members/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to remove member")
      }

      setMessage("Member removed.")
      try {
        await fetchData()
      } catch {
        setError("Member removed, but the team details could not be refreshed.")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to remove member")
    } finally {
      setRemovingUserId(null)
    }
  }

  const handleSetLeader = async () => {
    if (!selectedLeader) {
      setError("Select a team leader.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setSettingLeader(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch(`${apiUrl}/teams/set-leader`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ teamId: id, leaderId: selectedLeader }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to set team leader")
      }

      setMessage("Team leader updated.")
      try {
        await fetchData()
      } catch {
        setError("Leader updated, but the team details could not be refreshed.")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to set team leader")
    } finally {
      setSettingLeader(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!team) {
    return (
      <div role="alert" className="rounded-lg bg-red-50 p-8 text-red-700">
        {error || "Team not found"}
      </div>
    )
  }

  const currentMemberIds = new Set(team.members.map((member) => member.user.id))
  const availableUsers = allUsers.filter(
    (user) => !currentMemberIds.has(user.id),
  )

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">{team.name}</h1>
      <p className="mb-6 text-slate-600">
        {team.description || "No description"}
      </p>

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

      <div className="mb-6 rounded-xl bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold">Team Leader</h2>
        <div className="flex gap-2">
          <select
            aria-label="Select team leader"
            className="flex-1 rounded-lg border px-3 py-2"
            value={selectedLeader}
            onChange={(event) => setSelectedLeader(event.target.value)}
            disabled={settingLeader}
          >
            <option value="">Select leader...</option>
            {allUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!selectedLeader || settingLeader}
            onClick={handleSetLeader}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {settingLeader ? "Saving..." : "Set Leader"}
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-white p-4 shadow">
        <h2 className="mb-2 font-semibold">Add Member</h2>
        <div className="flex gap-2">
          <select
            aria-label="Select a member"
            className="flex-1 rounded-lg border px-3 py-2"
            value={selectedUser}
            onChange={(event) => setSelectedUser(event.target.value)}
          >
            <option value="">Select member...</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} ({user.email})
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!selectedUser || addingMember}
            onClick={handleAddMember}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {addingMember ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="mb-3 font-semibold">
          Team Members ({team.members.length})
        </h2>
        {team.members.length === 0 ? (
          <p className="text-slate-500">No members yet.</p>
        ) : (
          <div className="space-y-2">
            {team.members.map((member) => (
              <div
                key={member.user.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{member.user.fullName}</p>
                  <p className="text-sm text-slate-500">
                    {member.user.email}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={removingUserId !== null || addingMember}
                  onClick={() => handleRemoveMember(member.user.id)}
                  className="text-sm text-red-600 hover:underline disabled:opacity-50"
                >
                  {removingUserId === member.user.id
                    ? "Removing..."
                    : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
