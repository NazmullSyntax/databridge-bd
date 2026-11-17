"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function NewRequestPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    objective: "",
    dataCategory: "FIELD_SURVEY",
    requiredFields: "",
    targetLocation: "Dhaka",
    targetAudience: "",
    targetVolume: "",
    methodPref: "",
    dataFormat: "EXCEL",
    deadline: "",
    budgetMin: "",
    budgetMax: "",
    additionalNotes: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      const payload = {
        ...form,
        targetVolume: form.targetVolume
          ? parseInt(form.targetVolume)
          : undefined,
        budgetMin: form.budgetMin ? parseFloat(form.budgetMin) : undefined,
        budgetMax: form.budgetMax ? parseFloat(form.budgetMax) : undefined,
        deadline: form.deadline || undefined,
      }

      const res = await fetch(`${apiUrl}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      router.push("/dashboard/requests")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-bold">Submit Data Request</h1>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Project Title *
            </label>
            <input
              name="title"
              required
              className="w-full rounded border px-3 py-2"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Objective *
            </label>
            <textarea
              name="objective"
              required
              rows={3}
              className="w-full rounded border px-3 py-2"
              value={form.objective}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Data Category *
              </label>
              <select
                name="dataCategory"
                className="w-full rounded border px-3 py-2"
                value={form.dataCategory}
                onChange={handleChange}
              >
                <option value="FIELD_SURVEY">Field Survey</option>
                <option value="MARKET_RESEARCH">Market Research</option>
                <option value="BUSINESS_DATA">Business Data</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Data Format
              </label>
              <select
                name="dataFormat"
                className="w-full rounded border px-3 py-2"
                value={form.dataFormat}
                onChange={handleChange}
              >
                <option value="EXCEL">Excel</option>
                <option value="CSV">CSV</option>
                <option value="PDF">PDF</option>
                <option value="POWERBI">Power BI</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Required Fields (comma separated) *
            </label>
            <input
              name="requiredFields"
              required
              className="w-full rounded border px-3 py-2"
              placeholder="e.g. name, address, phone, category"
              value={form.requiredFields}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Target Location *
              </label>
              <input
                name="targetLocation"
                required
                className="w-full rounded border px-3 py-2"
                value={form.targetLocation}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Target Audience
              </label>
              <input
                name="targetAudience"
                className="w-full rounded border px-3 py-2"
                value={form.targetAudience}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Estimated Volume
              </label>
              <input
                name="targetVolume"
                type="number"
                className="w-full rounded border px-3 py-2"
                value={form.targetVolume}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Deadline</label>
              <input
                name="deadline"
                type="date"
                className="w-full rounded border px-3 py-2"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Budget Min (BDT)
              </label>
              <input
                name="budgetMin"
                type="number"
                className="w-full rounded border px-3 py-2"
                value={form.budgetMin}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Budget Max (BDT)
              </label>
              <input
                name="budgetMax"
                type="number"
                className="w-full rounded border px-3 py-2"
                value={form.budgetMax}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Additional Notes
            </label>
            <textarea
              name="additionalNotes"
              rows={2}
              className="w-full rounded border px-3 py-2"
              value={form.additionalNotes}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </div>
    </div>
  )
}
