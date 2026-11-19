import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B2548] py-16 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4">
        <div>
          <Link href="/" className="mb-4 block text-2xl font-bold">
            DataBridge<span className="text-cyan-400">BD</span>
          </Link>
          <p className="text-sm leading-relaxed text-gray-400">
            Managed data collection, research, and analytics services for a
            data-driven Bangladesh.
          </p>
        </div>
        <div>
          <h4 className="mb-4 font-semibold">Services</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/services" className="hover:text-cyan-400">
                Field Data Collection
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-cyan-400">
                Market Research
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-cyan-400">
                Survey & Questionnaire
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-cyan-400">
                Data Analysis
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/about" className="hover:text-cyan-400">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-cyan-400">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-cyan-400">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-cyan-400">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-semibold">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/privacy" className="hover:text-cyan-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-cyan-400">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 px-6 pt-8 text-center text-sm text-gray-500">
        © 2026 DataBridge BD. All rights reserved.
      </div>
    </footer>
  )
}
