"use client"

import { useEffect, useState, useRef } from "react"

type Message = {
  id: string
  body: string
  createdAt: string
  sender: { fullName: string; email: string; role: { name: string } }
}

type CurrentUser = {
  fullName: string
  email: string
  role?: string
}

export default function ProjectChat({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const [currentUser] = useState<CurrentUser | null>(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      if (userStr) return JSON.parse(userStr)
    }
    return null
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    // useEffect-এর ভেতরে সরাসরি async IIFE কল করা হলো
    const loadAndPollMessages = async () => {
      const token = localStorage.getItem("token")
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

      try {
        const res = await fetch(`${apiUrl}/messages/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success && isMounted) {
          setMessages(data.data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void loadAndPollMessages() // Initial load

    const interval = setInterval(loadAndPollMessages, 10000) // Poll every 10s

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [projectId])

  // Auto-scroll when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const token = localStorage.getItem("token")
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

    try {
      const res = await fetch(`${apiUrl}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId, body: newMessage }),
      })
      const data = await res.json()
      if (data.success) {
        setNewMessage("")
        // মেসেজ সেন্ড হওয়ার পর লিস্ট রিফ্রেশ করা
        const refreshRes = await fetch(
          `${apiUrl}/messages/project/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const refreshData = await refreshRes.json()
        if (refreshData.success) setMessages(refreshData.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setSending(false)
    }
  }

  if (loading)
    return <div className="p-4 text-center text-slate-500">Loading chat...</div>

  return (
    <div className="flex h-125 flex-col rounded-xl border bg-white shadow-sm">
      <div className="border-b p-3">
        <h3 className="font-semibold">Project Chat</h3>
        <p className="text-xs text-slate-500">{messages.length} messages</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((m) => {
            const isMe = m.sender.email === currentUser?.email
            return (
              <div
                key={m.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${isMe ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900"}`}
                >
                  <p className="mb-1 text-xs font-medium opacity-80">
                    {m.sender.fullName}{" "}
                    <span className="opacity-60">({m.sender.role.name})</span>
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{m.body}</p>
                  <p
                    className={`mt-1 text-xs ${isMe ? "text-blue-100" : "text-slate-500"}`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t p-3">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  )
}
