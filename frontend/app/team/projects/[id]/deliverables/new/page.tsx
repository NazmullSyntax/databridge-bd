"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export default function NewDeliverablePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    description: "",
    fileUrl: "",
    fileType: "PDF",
    fileSize: "1024",
    isFinal: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fileSize = Number(form.fileSize)
    if (!Number.isSafeInteger(fileSize) || fileSize < 0) {
      setError("File size must be a non-negative whole number.")
      return
    }

    setLoading(true)
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

    try {
      const res = await fetch(`${apiUrl}/deliverables`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: params.id,
          ...form,
          fileSize,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to upload deliverable")
      }

      router.push(`/team/projects/${params.id}`)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to upload deliverable",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link
        href={`/team/projects/${params.id}`}
        className="mb-4 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to Project
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Upload Deliverable</h1>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Title *</label>
          <input
            required
            className="w-full rounded border px-3 py-2"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>
          <textarea
            rows={3}
            className="w-full rounded border px-3 py-2"
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">File URL *</label>
          <input
            type="url"
            required
            className="w-full rounded border px-3 py-2"
            placeholder="https://..."
            value={form.fileUrl}
            onChange={(event) =>
              setForm({ ...form, fileUrl: event.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">File Type</label>
            <select
              className="w-full rounded border px-3 py-2"
              value={form.fileType}
              onChange={(event) =>
                setForm({ ...form, fileType: event.target.value })
              }
            >
              <option value="PDF">PDF</option>
              <option value="EXCEL">Excel</option>
              <option value="CSV">CSV</option>
              <option value="PNG">PNG</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              File Size (bytes)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              required
              className="w-full rounded border px-3 py-2"
              value={form.fileSize}
              onChange={(event) =>
                setForm({ ...form, fileSize: event.target.value })
              }
            />
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isFinal}
            onChange={(event) =>
              setForm({ ...form, isFinal: event.target.checked })
            }
          />
          <span className="text-sm">Mark as final deliverable</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black py-2 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Deliverable"}
        </button>
      </form>
    </div>
  )
}
