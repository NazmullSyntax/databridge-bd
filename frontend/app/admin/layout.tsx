"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const userStr = localStorage.getItem("user")

      if (!token || !userStr) {
        router.push("/login")
        return
      }

      const user = JSON.parse(userStr)
      if (user.role !== "ADMIN") {
        router.push("/dashboard")
        return
      }

      setAuthorized(true)
    }

    // Wrap in a timeout or call directly inside a function
    // to avoid ESLint warning
    checkAuth()
  }, [router])

  if (!authorized)
    return <div className="p-8 text-center">Checking access...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 p-4 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <h1 className="text-xl font-bold">DataBridge BD - Admin Panel</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token")
              localStorage.removeItem("user")
              router.push("/login")
            }}
            className="rounded bg-red-600 px-3 py-1 text-sm"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  )
}
