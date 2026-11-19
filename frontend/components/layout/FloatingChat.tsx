"use client"

import { useState, type FormEvent } from "react"
import { MessageSquare, X, Send } from "lucide-react"

type ChatMessage = {
  id: string
  text: string
  sender: "user" | "bot"
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! 👋 How can we help you with your data requirements today?",
      sender: "bot",
    },
  ])

  const handleSend = (event: FormEvent) => {
    event.preventDefault()
    const text = input.trim()
    if (!text) return

    const id = Date.now().toString()
    setMessages((previous) => [
      ...previous,
      { id, text, sender: "user" },
    ])
    setInput("")

    setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        {
          id: `${id}-reply`,
          text: "Thank you for reaching out! One of our team members will reply shortly.",
          sender: "bot",
        },
      ])
    }, 1000)
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="animate-in slide-in-from-bottom-5 mb-4 w-80 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[#061A35] p-4 text-white">
            <div>
              <h3 className="font-bold">DataBridge BD</h3>
              <p className="text-xs text-cyan-400">
                Typically replies in minutes
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 transition-colors hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex h-64 flex-col gap-3 overflow-y-auto bg-[#F8FAFC] p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${
                  message.sender === "user"
                    ? "self-end rounded-tr-none bg-cyan-500 text-black"
                    : "self-start rounded-tl-none bg-white text-[#102A43]"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            className="flex gap-2 border-t border-[#E2E8F0] bg-white p-3"
          >
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button
              type="submit"
              className="rounded-lg bg-cyan-500 p-2 text-black transition-colors hover:bg-cyan-600"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="glow-effect flex items-center justify-center rounded-full bg-cyan-500 p-4 text-black shadow-lg transition-all hover:scale-105 hover:bg-cyan-400"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  )
}
