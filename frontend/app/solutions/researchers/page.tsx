import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function ResearchersSolutionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[#061A35] pt-32 pb-20">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Academic <span className="text-gradient">Research Support</span>
          </h1>
          <p className="mb-8 text-lg text-gray-400">
            Get practical research data support for your academic and research
            projects.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-[#102A43]">
              Support for Your Thesis & Research
            </h2>
            <p className="mb-6 leading-relaxed text-[#64748B]">
              We understand the challenges of primary data collection. Whether
              you are a student or a professional researcher, we can help you
              gather the data you need.
            </p>
            <ul className="space-y-4">
              {[
                "Primary Data Collection",
                "Survey and Questionnaire Support",
                "Data Cleaning & Verification",
                "Statistical Analysis",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 font-medium text-[#102A43]"
                >
                  <CheckCircle2 className="shrink-0 text-cyan-500" size={20} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-8">
            <h3 className="mb-4 text-xl font-bold text-[#102A43]">
              Get Research Data
            </h3>
            <p className="mb-6 text-sm text-[#64748B]">
              Submit your research requirements and let us handle the data
              collection.
            </p>
            <Link
              href="/request"
              className="inline-block w-full rounded-lg bg-[#102A43] px-6 py-3 text-center font-semibold text-white transition-all hover:bg-[#1a3c5c]"
            >
              Start Your Research
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
