"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Submission = {
  id: string
  title: string
  description: string | null
  fileUrl: string | null
  status: string
  version: number
  submitter: { fullName: string; email: string }
  createdAt: string
}

type StatusMessage = {
  text: string
  success: boolean
}

export default function AdminSubmissionsPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState<StatusMessage | null>(null)
  const [reviewingId, setReviewingId] = useState<string | null>(null)

  const fetchSubmissions = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      throw new Error("Please sign in to review submissions.")
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    const projectsRes = await fetch(`${apiUrl}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const projectsData = await projectsRes.json()
    if (!projectsRes.ok || !projectsData.success) {
      throw new Error(projectsData.message || "Failed to load projects")
    }
    if (!Array.isArray(projectsData.data)) {
      throw new Error("Projects response was invalid")
    }

    const submissionResults = await Promise.all(
      projectsData.data.map(async (project: { id: string }) => {
        const res = await fetch(
          `${apiUrl}/submissions/project/${project.id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load submissions")
        }
        if (!Array.isArray(data.data)) {
          throw new Error("Submissions response was invalid")
        }
        return data.data as Submission[]
      }),
    )

    setSubmissions(
      submissionResults
        .flat()
        .sort(
          (first, second) =>
            new Date(second.createdAt).getTime() -
            new Date(first.createdAt).getTime(),
        ),
    )
  }, [router])

  useEffect(() => {
    let active = true

    fetchSubmissions()
      .then(() => {
        if (active) setError("")
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load submissions",
          )
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [fetchSubmissions])

  const handleReview = async (id: string, status: string) => {
    const notes = window.prompt("Add notes (optional):")
    if (notes === null) return

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setReviewingId(id)
    setError("")
    setMessage(null)

    try {
      const res = await fetch(`${apiUrl}/submissions/${id}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, notes }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to review submission")
      }

      setMessage({ text: "Submission review saved.", success: true })
      try {
        await fetchSubmissions()
      } catch {
        setError("Review saved, but submissions could not be refreshed.")
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to review submission",
      )
    } finally {
      setReviewingId(null)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Work Submissions</h1>

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

      {submissions.length === 0 ? (
        <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow">
          No submissions yet.
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">
                    {submission.title}{" "}
                    <span className="text-xs text-slate-500">
                      v{submission.version}
                    </span>
                  </h2>
                  <p className="text-sm text-slate-500">
                    By: {submission.submitter.fullName} (
                    {submission.submitter.email})
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    submission.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : submission.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {submission.status}
                </span>
              </div>

              {submission.description && (
                <p className="mt-2 text-sm">{submission.description}</p>
              )}
              {submission.fileUrl && (
                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm text-blue-600 hover:underline"
                >
                  View File
                </a>
              )}

              {submission.status === "SUBMITTED" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={reviewingId !== null}
                    onClick={() => handleReview(submission.id, "APPROVED")}
                    className="rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {reviewingId === submission.id
                      ? "Saving..."
                      : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={reviewingId !== null}
                    onClick={() => handleReview(submission.id, "REJECTED")}
                    className="rounded-lg bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={reviewingId !== null}
                    onClick={() =>
                      handleReview(submission.id, "REVISION_REQUESTED")
                    }
                    className="rounded-lg bg-yellow-600 px-4 py-1.5 text-sm text-white hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Request Revision
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
