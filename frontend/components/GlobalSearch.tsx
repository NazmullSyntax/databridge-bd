"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function GlobalSearch() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-64">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-lg border border-slate-200 py-1.5 pr-3 pl-9 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <span className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
        🔍
      </span>
    </form>
  )
}
