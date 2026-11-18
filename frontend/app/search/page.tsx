"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

// ১. নির্দিষ্ট টাইপ ডিফাইন করা হলো (any এর বদলে)
type Project = { id: string; title: string; projectCode: string }
type Request = { id: string; title: string; requestNumber: string }
type Member = { id: string; fullName: string; email: string }
type SearchResults = {
  projects: Project[]
  requests: Request[]
  members: Member[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = searchParams.get("q") || ""

  // ২. useState-এ any এর বদলে SearchResults টাইপ ব্যবহার করা হলো
  const [results, setResults] = useState<SearchResults>({
    projects: [],
    requests: [],
    members: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")
    const user = userStr ? JSON.parse(userStr) : null
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

    const fetchResults = async () => {
      try {
        const [projRes, reqRes, teamRes] = await Promise.all([
          fetch(`${apiUrl}/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${apiUrl}/requests/my`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          user?.role === "ADMIN"
            ? fetch(`${apiUrl}/admin/team`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            : Promise.resolve({ json: () => ({ data: [] }) }),
        ])

        const projData = await projRes.json()
        const reqData = await reqRes.json()
        const teamData = await teamRes.json()

        const qLower = q.toLowerCase()
        setResults({
          // ৩. এখানেও any এর বদলে নির্দিষ্ট টাইপ বসানো হলো
          projects: (projData.data || []).filter((p: Project) =>
            p.title?.toLowerCase().includes(qLower)
          ),
          requests: (reqData.data || []).filter((r: Request) =>
            r.title?.toLowerCase().includes(qLower)
          ),
          members: (teamData.data || []).filter((m: Member) =>
            m.fullName?.toLowerCase().includes(qLower)
          ),
        })
      } catch {
        /* silent */
      } finally {
        setLoading(false)
      }
    }

    if (q) fetchResults()
  }, [q])

  if (loading) return <div className="p-8">Searching...</div>

  const hasResults =
    results.projects.length > 0 ||
    results.requests.length > 0 ||
    results.members.length > 0

  return (
    <div className="mx-auto max-w-4xl p-8">
      {/* ৪. এখানে ডাবল কোট (") এর বদলে &quot; ব্যবহার করা হলো */}
      <h1 className="mb-6 text-2xl font-bold">
        Search Results for &quot;{q}&quot;
      </h1>

      {!hasResults && (
        <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow">
          No results found.
        </div>
      )}

      {results.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 font-semibold">Projects</h2>
          <div className="space-y-2">
            {results.projects.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border bg-white p-3 shadow-sm"
              >
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-slate-500">{p.projectCode}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.requests.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 font-semibold">Requests</h2>
          <div className="space-y-2">
            {results.requests.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border bg-white p-3 shadow-sm"
              >
                <p className="font-medium">{r.title}</p>
                <p className="text-xs text-slate-500">{r.requestNumber}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.members.length > 0 && (
        <div>
          <h2 className="mb-2 font-semibold">Team Members</h2>
          <div className="space-y-2">
            {results.members.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border bg-white p-3 shadow-sm"
              >
                <p className="font-medium">{m.fullName}</p>
                <p className="text-xs text-slate-500">{m.email}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
