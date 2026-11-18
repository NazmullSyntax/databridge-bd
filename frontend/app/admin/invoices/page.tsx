"use client"

import { useEffect, useState } from "react"

type Invoice = {
  id: string
  invoiceNo: string
  amount: string
  status: string
  order: {
    quotation: {
      request: { title: string; customer: { fullName: string } }
    }
  }
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvoices = async () => {
      const token = localStorage.getItem("token")
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
      try {
        const res = await fetch(`${apiUrl}/invoices`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) setInvoices(data.data)
      } catch {
        /* silent */
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  const handleRecordPayment = async (invoiceId: string) => {
    const amount = prompt("Amount:")
    const method = prompt("Method (BKASH/SSLCOMMERZ/CASH):")
    if (!amount || !method) return

    const token = localStorage.getItem("token")
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    await fetch(`${apiUrl}/invoices/${invoiceId}/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, method }),
    })
    window.location.reload()
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Invoices</h1>
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-3">Invoice #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invoices.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No invoices yet.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-4 py-3 font-medium">{inv.invoiceNo}</td>
                  <td className="px-4 py-3">
                    {inv.order.quotation.request.customer.fullName}
                  </td>
                  <td className="px-4 py-3">৳{inv.amount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        inv.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {inv.status === "UNPAID" && (
                      <button
                        onClick={() => handleRecordPayment(inv.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Record Payment
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
