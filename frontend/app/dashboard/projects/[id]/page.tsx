"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import ProjectChat from "@/components/ProjectChat"

type Deliverable = {
  id: string
  title: string
  description: string | null
  fileUrl: string
  fileType: string
  isFinal: boolean
  uploadedAt: string
}

type Submission = {
  id: string
  title: string
  version: number
  fileUrl: string | null
  customerApproved: boolean | null
}

type Project = {
  id: string
  projectCode: string
  title: string
  status: string
  progress: number
  dueDate: string | null
  deliverables: Deliverable[]
  assignments: Array<{ user: { fullName: string } }>
}

export default function CustomerProjectDetail() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [submissionError, setSubmissionError] = useState("")
  const [submissionMessage, setSubmissionMessage] = useState("")
  const [reviewingSubmissionId, setReviewingSubmissionId] = useState<
    string | null
  >(null)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [reviewError, setReviewError] = useState("")
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchProject = async () => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

      try {
        const res = await fetch(
          `${apiUrl}/projects/customer/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load project")
        }
        setProject(data.data)

        try {
          const submissionsRes = await fetch(
            `${apiUrl}/submissions/customer/project/${params.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          const submissionsData = await submissionsRes.json()
          if (!submissionsRes.ok || !submissionsData.success) {
            throw new Error(
              submissionsData.message || "Failed to load submissions",
            )
          }
          if (!Array.isArray(submissionsData.data)) {
            throw new Error("Submissions response was invalid")
          }
          setSubmissions(submissionsData.data)
        } catch (err: unknown) {
          setSubmissionError(
            err instanceof Error
              ? err.message
              : "Failed to load submissions",
          )
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id, router])

  const handleCustomerReview = async (
    submissionId: string,
    approved: boolean,
  ) => {
    const notes = window.prompt("Add notes (optional):")
    if (notes === null) return

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setReviewingSubmissionId(submissionId)
    setSubmissionError("")
    setSubmissionMessage("")

    try {
      const res = await fetch(
        `${apiUrl}/submissions/${submissionId}/customer-review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ approved, notes }),
        },
      )
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit your review")
      }

      setSubmissions((currentSubmissions) =>
        currentSubmissions.map((submission) =>
          submission.id === submissionId
            ? { ...submission, customerApproved: approved }
            : submission,
        ),
      )
      setSubmissionMessage("Submission review saved.")
    } catch (err: unknown) {
      setSubmissionError(
        err instanceof Error
          ? err.message
          : "Failed to submit your review",
      )
    } finally {
      setReviewingSubmissionId(null)
    }
  }

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    if (!project) return

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setReviewError("")
    setReviewSubmitting(true)

    try {
      const res = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId: project.id, rating, comment }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit review")
      }

      setReviewSubmitted(true)
    } catch (err: unknown) {
      setReviewError(
        err instanceof Error ? err.message : "Failed to submit review",
      )
    } finally {
      setReviewSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  if (error || !project) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <p role="alert" className="mb-4 text-red-600">
          {error || "Project not found."}
        </p>
        <Link
          href="/dashboard/projects"
          className="text-sm text-blue-600 hover:underline"
        >
          ← My Projects
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard/projects"
          className="mb-4 inline-block text-sm text-blue-600 hover:underline"
        >
          ← My Projects
        </Link>
        <h1 className="mb-2 text-2xl font-bold">{project.title}</h1>
        <p className="mb-6 text-sm text-gray-500">
          {project.projectCode} • Due:{" "}
          {project.dueDate
            ? new Date(project.dueDate).toLocaleDateString()
            : "N/A"}
        </p>

        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 font-semibold">Project Progress</h2>
          <div className="h-3 rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-green-600 transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {project.progress}% complete
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Status: {project.status}
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-2 font-semibold">Assigned Team</h2>
          <p className="text-sm text-gray-600">
            {project.assignments
              .map((assignment) => assignment.user.fullName)
              .join(", ") || "Not assigned yet"}
          </p>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-3 font-semibold">Deliverables</h2>
          {project.deliverables.length === 0 ? (
            <p className="text-sm text-gray-500">
              No deliverables uploaded yet. Please wait for the team to complete
              the work.
            </p>
          ) : (
            <div className="space-y-3">
              {project.deliverables.map((deliverable) => (
                <div key={deliverable.id} className="rounded border p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{deliverable.title}</h3>
                      {deliverable.description && (
                        <p className="text-sm text-gray-600">
                          {deliverable.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        {deliverable.fileType} •{" "}
                        {new Date(
                          deliverable.uploadedAt,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {deliverable.isFinal && (
                        <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                          Final
                        </span>
                      )}
                      <a
                        href={deliverable.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Download ↓
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-3 font-semibold">Review Submissions</h2>
          {submissionError && (
            <p
              role="alert"
              className="mb-3 rounded bg-red-50 p-3 text-sm text-red-700"
            >
              {submissionError}
            </p>
          )}
          {submissionMessage && (
            <p
              role="status"
              className="mb-3 rounded bg-green-50 p-3 text-sm text-green-700"
            >
              {submissionMessage}
            </p>
          )}
          {submissions.length === 0 ? (
            <p className="text-sm text-slate-500">
              No submissions to review yet.
            </p>
          ) : (
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div key={submission.id} className="rounded-lg border p-3">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-medium">{submission.title}</h3>
                      <p className="text-sm text-slate-500">
                        Version {submission.version}
                      </p>
                    </div>
                    <span
                      className={`h-fit rounded-full px-2 py-1 text-xs ${
                        submission.customerApproved === true
                          ? "bg-green-100 text-green-700"
                          : submission.customerApproved === false
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {submission.customerApproved === true
                        ? "Approved"
                        : submission.customerApproved === false
                          ? "Rejected"
                          : "Pending"}
                    </span>
                  </div>
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
                  {submission.customerApproved === null && (
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        disabled={reviewingSubmissionId !== null}
                        onClick={() =>
                          handleCustomerReview(submission.id, true)
                        }
                        className="rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {reviewingSubmissionId === submission.id
                          ? "Submitting..."
                          : "Approve"}
                      </button>
                      <button
                        type="button"
                        disabled={reviewingSubmissionId !== null}
                        onClick={() =>
                          handleCustomerReview(submission.id, false)
                        }
                        className="rounded-lg bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {project.status === "COMPLETED" && !reviewSubmitted && (
          <div className="mt-6 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Rate this Project</h2>
            {reviewError && (
              <p
                role="alert"
                className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700"
              >
                {reviewError}
              </p>
            )}
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} out of 5 stars`}
                    aria-pressed={rating === star}
                    disabled={reviewSubmitting}
                    onClick={() => setRating(star)}
                    className={`text-3xl disabled:opacity-50 ${
                      rating >= star ? "text-yellow-400" : "text-slate-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <label htmlFor="project-review" className="sr-only">
                Your feedback
              </label>
              <textarea
                id="project-review"
                placeholder="Write your feedback..."
                className="mb-4 w-full rounded-lg border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                disabled={reviewSubmitting}
              />
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {reviewSubmitted && (
          <div
            role="status"
            className="mt-6 rounded-lg bg-green-50 p-4 text-center text-green-700"
          >
            Thank you for your feedback!
          </div>
        )}

        <div className="mt-6">
          <ProjectChat projectId={String(params.id)} />
        </div>
      </div>
    </div>
  )
}
