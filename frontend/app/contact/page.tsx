import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="relative overflow-hidden bg-[#061A35] pt-20 pb-20 text-center">
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Let&apos;s talk about{" "}
            <span className="text-gradient">your data needs.</span>
          </h1>
          <p className="text-lg text-gray-400">
            Reach out to us for inquiries, consultation, or support.
          </p>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-10 max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 shadow-sm md:p-12">
            <h2 className="mb-6 text-2xl font-bold text-[#102A43]">
              Send us a message
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#102A43]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#102A43]">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#102A43]">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#102A43]">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-[#E2E8F0] px-4 py-2.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                  placeholder="Describe your requirements..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-[#102A43] py-3 font-semibold text-white transition-all hover:bg-[#1a3c5c]"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-50">
                <Mail className="text-cyan-600" />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-[#102A43]">Email Us</h3>
                <p className="mb-2 text-sm text-[#64748B]">
                  For general inquiries and project requests.
                </p>
                <a
                  href="mailto:info@databridgebd.com"
                  className="text-sm font-semibold text-blue-600"
                >
                  info@databridgebd.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-50">
                <Phone className="text-cyan-600" />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-[#102A43]">Call Us</h3>
                <p className="mb-2 text-sm text-[#64748B]">
                  Available Saturday - Thursday, 9am to 6pm.
                </p>
                <a
                  href="tel:+8801234567890"
                  className="text-sm font-semibold text-blue-600"
                >
                  +880 1234 567 890
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-xl border border-[#E2E8F0] bg-white p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-50">
                <MapPin className="text-cyan-600" />
              </div>
              <div>
                <h3 className="mb-1 font-bold text-[#102A43]">Visit Us</h3>
                <p className="mb-2 text-sm text-[#64748B]">
                  Our main office location.
                </p>
                <p className="text-sm font-semibold text-[#102A43]">
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
