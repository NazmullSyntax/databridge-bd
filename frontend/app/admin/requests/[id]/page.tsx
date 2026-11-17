"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"

type RequestDetail = {
  id: string
  requestNumber: string
  title: string
  objective: string
  dataCategory: string
  targetLocation: string
  requiredFields: string
  status: string
  customer: { fullName: string; email: string; phone?: string }
  quotations: Array<{ id: string; quoteNumber: string; amount: string }>
}

export default function QuotationPage() {
  const router = useRouter()
  const params = useParams()
  const [request, setRequest] = useState<RequestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    amount: "",
    description: "",
    validUntil: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchDetail = async () => {
      const token = localStorage.getItem("token")
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

      try {
        const res = await fetch(`${apiUrl}/admin/requests/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setRequest(data.data)
      } catch {
        // silent
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccess("")

    const token = localStorage.getItem("token")
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

    try {
      const res = await fetch(
        `${apiUrl}/admin/requests/${params.id}/quotation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: parseFloat(form.amount),
            description: form.description,
            validUntil: form.validUntil,
          }),
        }
      )
      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      setSuccess("✅ Quotation sent successfully!")
      setTimeout(() => router.push("/admin"), 2000)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !request)
    return <div className="p-8 text-center">Loading...</div>

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Request Details</h2>

      <div className="mb-6 rounded bg-white p-6 shadow">
        <h3 className="mb-2 text-xl font-semibold">{request.title}</h3>
        <p className="text-sm text-gray-600">
          Request #: {request.requestNumber}
        </p>
        <p className="text-sm text-gray-600">
          Customer: {request.customer.fullName} ({request.customer.email})
        </p>

        <hr className="my-4" />

        <div className="space-y-2 text-sm">
          <p>
            <strong>Objective:</strong> {request.objective}
          </p>
          <p>
            <strong>Category:</strong> {request.dataCategory}
          </p>
          <p>
            <strong>Location:</strong> {request.targetLocation}
          </p>
          <p>
            <strong>Required Fields:</strong> {request.requiredFields}
          </p>
          <p>
            <strong>Status:</strong> {request.status}
          </p>
        </div>
      </div>

      <div className="rounded bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Send Quotation</h3>

        {success && (
          <div className="mb-4 rounded bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Amount (BDT) *
            </label>
            <input
              type="number"
              required
              className="w-full rounded border px-3 py-2"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description *
            </label>
            <textarea
              required
              rows={3}
              className="w-full rounded border px-3 py-2"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Valid Until *
            </label>
            <input
              type="date"
              required
              className="w-full rounded border px-3 py-2"
              value={form.validUntil}
              onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-black py-2 text-white hover:bg-gray-800"
          >
            {submitting ? "Sending..." : "Send Quotation"}
          </button>
        </form>
      </div>
    </div>
  )
}
