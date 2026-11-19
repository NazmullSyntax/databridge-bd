import Link from "next/link"

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#061A35]/95 text-white backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          DataBridge<span className="text-cyan-400">BD</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-300 lg:flex">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/services" className="transition hover:text-white">
            Services
          </Link>
          <Link href="/solutions" className="transition hover:text-white">
            Solutions
          </Link>
          <Link href="/about" className="transition hover:text-white">
            About
          </Link>
          <Link href="/contact" className="transition hover:text-white">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium transition hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/request"
            className="rounded-md bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-black glow-effect transition-all hover:bg-cyan-400"
          >
            Tell Us What You Need
          </Link>
        </div>
      </div>
    </header>
  )
}
