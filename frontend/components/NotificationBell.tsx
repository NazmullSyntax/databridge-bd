"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"

type Notification = {
  id: string
  title: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: string
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

    try {
      const res = await fetch(`${apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load notifications")
      }
      if (!Array.isArray(data.data) || !Number.isInteger(data.unreadCount)) {
        throw new Error("Notifications response was invalid")
      }

      setNotifications(data.data)
      setUnreadCount(data.unreadCount)
      setError("")
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load notifications",
      )
    }
  }, [])

  useEffect(() => {
    void fetchNotifications()
    const interval = setInterval(() => {
      void fetchNotifications()
    }, 30_000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const markAllRead = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Please sign in to update notifications.")
      return
    }

    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    try {
      const res = await fetch(`${apiUrl}/notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to mark notifications as read")
      }
      await fetchNotifications()
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark notifications as read",
      )
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 hover:bg-slate-100"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b p-3">
            <h2 className="text-sm font-semibold">Notifications</h2>
            <button
              type="button"
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="text-xs text-blue-600 hover:underline disabled:text-slate-400 disabled:no-underline"
            >
              Mark all read
            </button>
          </div>
          {error && (
            <p role="alert" className="p-3 text-xs text-red-600">
              {error}
            </p>
          )}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-slate-500">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link || "#"}
                  className={`block border-b p-3 hover:bg-slate-50 ${
                    !notification.isRead ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <p className="text-sm font-medium text-slate-900">
                    {notification.title}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
