"use client"

import { useEffect, useState } from "react"

type AuditLog = {
  id: string
  action: string
  entity: string
  entityId: string
  createdAt: string
  user: { fullName: string; email: string } | null
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // useEffect-এর ভেতরে async ফাংশন ডিফাইন করা হলো
    const fetchLogs = async () => {
      const token = localStorage.getItem("token")
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

      try {
        const res = await fetch(`${apiUrl}/audit`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          setLogs(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch logs", error)
      } finally {
        setLoading(false)
      }
    }

    // ফাংশনটি কল করা হলো
    void fetchLogs()
  }, []) // ডিপেন্ডেন্সি অ্যারে ফাঁকা, কারণ এটি শুধু একবার লোড হবে

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Audit Logs</h1>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">User</th>
              <th className="px-4 py-3 font-semibold">Action</th>
              <th className="px-4 py-3 font-semibold">Entity</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">{log.user?.fullName || "System"}</td>
                <td className="px-4 py-3 font-medium">{log.action}</td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {log.entity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
