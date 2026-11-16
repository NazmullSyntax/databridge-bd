import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-xl font-bold text-primary">
            DataBridge BD
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/services" className="transition hover:text-primary">
              Services
            </Link>
            <Link
              href="/how-it-works"
              className="transition hover:text-primary"
            >
              How It Works
            </Link>
            <Link href="/pricing" className="transition hover:text-primary">
              Pricing
            </Link>
            <Link href="/contact" className="transition hover:text-primary">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium transition hover:text-primary"
            >
              Login
            </Link>
            <Button render={<Link href="/register" />} size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center bg-linear-to-b from-blue-50 to-white px-4 py-24 text-center">
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
          Your Data Requirements. <br />
          <span className="text-blue-600">
            Our Research. Reliable Insights.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
          We collect, verify, analyze, and deliver the business data you need.
          Tell us what you need—we do the rest.
        </p>
        <div className="mt-10 flex gap-4">
          <Button render={<Link href="/request" />} size="lg">
            Submit Data Request
          </Button>
          <Button
            render={<Link href="/services" />}
            variant="outline"
            size="lg"
            className="border-black text-black"
          >
            Explore Services
          </Button>
        </div>
      </section>

      {/* Services Preview */}
      <section className="container mx-auto bg-white px-4 py-20 text-black">
        <h2 className="mb-12 text-center text-3xl font-bold">Our Services</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Field Survey",
              desc: "On-ground data collection with verified respondents.",
            },
            {
              title: "Market Research",
              desc: "Comprehensive market analysis for Bangladesh.",
            },
            {
              title: "Business Data",
              desc: "Verified business information across the country.",
            },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-lg border p-6 transition hover:shadow-lg"
            >
              <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} DataBridge BD. All rights reserved.
      </footer>
    </div>
  )
}
