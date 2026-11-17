"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

type Quotation = {
  id: string
  quoteNumber: string
  amount: string
  currency: string
  description: string
  validUntil: string
  status: string
}

type RequestDetail = {
  id: string
  requestNumber: string
  title: string
  objective: string
  status: string
  quotations: Quotation[]
}

export default function CustomerRequestDetail() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [request, setRequest] = useState<RequestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [pendingQuotationId, setPendingQuotationId] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const fetchDetail = async () => {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

      try {
        const res = await fetch(`${apiUrl}/requests/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to load request")
        }
        setRequest(data.data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load request")
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [params.id, router])

  const handleQuotationAction = async (
    quotationId: string,
    action: "accept" | "reject",
  ) => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    setPendingQuotationId(quotationId)
    setError("")
    setMessage("")

    try {
      const res = await fetch(
        `${apiUrl}/requests/${quotationId}/${action}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update quotation")
      }

      setMessage(
        action === "accept"
          ? "Quotation accepted. Order created."
          : "Quotation rejected.",
      )
      setTimeout(() => router.push("/dashboard/requests"), 2000)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to update quotation",
      )
    } finally {
      setPendingQuotationId(null)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  if (error && !request) {
    return (
      <div role="alert" className="p-8 text-center text-red-600">
        {error}
      </div>
    )
  }

  if (!request) {
    return (
      <div role="alert" className="p-8 text-center text-red-600">
        Request not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-2xl font-bold">{request.title}</h1>
        <p className="mb-6 text-sm text-gray-600">
          {request.requestNumber} • Status:{" "}
          <span className="font-semibold">{request.status}</span>
        </p>

        {message && (
          <div
            role="status"
            className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-700"
          >
            {message}
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="mb-4 rounded bg-white p-4 shadow">
          <h2 className="mb-2 font-semibold">Objective</h2>
          <p className="text-sm text-gray-600">{request.objective}</p>
        </div>

        <h2 className="mb-4 text-xl font-bold">Quotations</h2>

        {request.quotations.length === 0 ? (
          <div className="rounded bg-white p-6 text-center text-gray-500">
            No quotations yet. Please wait for the admin to review.
          </div>
        ) : (
          <div className="space-y-4">
            {request.quotations.map((quote) => (
              <div
                key={quote.id}
                className="rounded border-l-4 border-green-500 bg-white p-4 shadow"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-semibold">{quote.quoteNumber}</h3>
                  <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">
                    {quote.status}
                  </span>
                </div>
                <p className="mb-2 text-lg font-bold">
                  {quote.amount} {quote.currency}
                </p>
                <p className="mb-2 text-sm text-gray-600">
                  {quote.description}
                </p>
                <p className="text-xs text-gray-500">
                  Valid until:{" "}
                  {new Date(quote.validUntil).toLocaleDateString()}
                </p>

                {quote.status === "SENT" && (
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      disabled={pendingQuotationId !== null || message !== ""}
                      onClick={() =>
                        handleQuotationAction(quote.id, "accept")
                      }
                      className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {pendingQuotationId === quote.id
                        ? "Processing..."
                        : "Accept"}
                    </button>
                    <button
                      type="button"
                      disabled={pendingQuotationId !== null || message !== ""}
                      onClick={() =>
                        handleQuotationAction(quote.id, "reject")
                      }
                      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
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
    </div>
  )
}
