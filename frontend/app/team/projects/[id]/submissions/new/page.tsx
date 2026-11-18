"use client"

import { useState, type FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"

type SubmissionForm = {
  title: string
  description: string
  fileUrl: string
  fileType: string
  fileSize: string
}

type StatusMessage = {
  text: string
  success: boolean
}

export default function NewSubmissionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [form, setForm] = useState<SubmissionForm>({
    title: "",
    description: "",
    fileUrl: "",
    fileType: "PDF",
    fileSize: "1024",
  })
  const [message, setMessage] = useState<StatusMessage | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fileSize = form.fileSize ? Number(form.fileSize) : undefined
    if (
      fileSize !== undefined &&
      (!Number.isInteger(fileSize) || fileSize < 0)
    ) {
      setMessage({
        text: "File size must be a non-negative whole number.",
        success: false,
      })
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setLoading(true)

    try {
      const res = await fetch(`${apiUrl}/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId: id,
          ...form,
          fileSize,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit work")
      }

      setMessage({ text: "Submission created!", success: true })
      setTimeout(() => router.push(`/team/projects/${id}`), 1500)
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : "Failed to submit work",
        success: false,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Submit Work</h1>

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

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div>
          <label
            htmlFor="submission-title"
            className="mb-1 block text-sm font-medium"
          >
            Title *
          </label>
          <input
            id="submission-title"
            required
            className="w-full rounded-lg border px-3 py-2"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="submission-description"
            className="mb-1 block text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id="submission-description"
            rows={3}
            className="w-full rounded-lg border px-3 py-2"
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="submission-file-url"
            className="mb-1 block text-sm font-medium"
          >
            File URL
          </label>
          <input
            id="submission-file-url"
            type="url"
            placeholder="https://..."
            className="w-full rounded-lg border px-3 py-2"
            value={form.fileUrl}
            onChange={(event) =>
              setForm({ ...form, fileUrl: event.target.value })
            }
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="submission-file-type"
              className="mb-1 block text-sm font-medium"
            >
              File Type
            </label>
            <select
              id="submission-file-type"
              className="w-full rounded-lg border px-3 py-2"
              value={form.fileType}
              onChange={(event) =>
                setForm({ ...form, fileType: event.target.value })
              }
              disabled={loading}
            >
              <option value="PDF">PDF</option>
              <option value="EXCEL">Excel</option>
              <option value="CSV">CSV</option>
              <option value="PNG">PNG</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="submission-file-size"
              className="mb-1 block text-sm font-medium"
            >
              File Size (bytes)
            </label>
            <input
              id="submission-file-size"
              type="number"
              min={0}
              step={1}
              className="w-full rounded-lg border px-3 py-2"
              value={form.fileSize}
              onChange={(event) =>
                setForm({ ...form, fileSize: event.target.value })
              }
              disabled={loading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Work"}
        </button>
      </form>
    </div>
  )
}
