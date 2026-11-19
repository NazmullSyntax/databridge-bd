"use client"

import { useState } from "react"
import { MessageSquare, X, Send } from "lucide-react"

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="animate-in slide-in-from-bottom-5 mb-4 w-80 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#061A35] p-4 text-white">
            <div>
              <h3 className="font-bold">DataBridge BD</h3>
              <p className="text-xs text-cyan-400">
                Typically replies in minutes
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="h-64 overflow-y-auto bg-[#F8FAFC] p-4">
            <div className="mb-3 max-w-[85%] rounded-lg rounded-tl-none bg-white p-3 text-sm text-[#102A43] shadow-sm">
              Hello! 👋 How can we help you with your data requirements today?
            </div>
          </div>

          {/* Input Area */}
          <div className="flex gap-2 border-t border-[#E2E8F0] bg-white p-3">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 rounded-lg border border-[#E2E8F0] px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="rounded-lg bg-cyan-500 p-2 text-black transition-colors hover:bg-cyan-600">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full bg-cyan-500 p-4 text-black shadow-lg glow-effect transition-all hover:scale-105 hover:bg-cyan-400"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  )
}
