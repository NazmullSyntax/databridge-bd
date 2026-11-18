"use client"

import { useState } from "react"

export default function FileUpload({
  onUploadSuccess,
}: {
  onUploadSuccess: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")

    const token = localStorage.getItem("token")
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${apiUrl}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        onUploadSuccess(data.data.url)
      } else {
        setError(data.message)
      }
    } catch {
      setError("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">Upload File</label>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full rounded-lg border px-3 py-2"
      />
      {uploading && <p className="mt-1 text-xs text-blue-600">Uploading...</p>}
      {error && <p className="mt-1 text-xs text-red-600">❌ {error}</p>}
    </div>
  )
}
