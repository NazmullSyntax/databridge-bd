import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function NgoSolutionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-[#061A35] pt-32 pb-20">
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            NGO & Organization <span className="text-gradient">Solutions</span>
          </h1>
          <p className="mb-8 text-lg text-gray-400">
            Strengthen your projects with trusted field research and M&E data.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-[#102A43]">
              Data-Driven Development
            </h2>
            <p className="mb-6 leading-relaxed text-[#64748B]">
              We help NGOs and development organizations collect baseline data,
              monitor project progress, and evaluate impact with rigorous field
              research.
            </p>
            <ul className="space-y-4">
              {[
                "Baseline and Endline Surveys",
                "Monitoring and Evaluation (M&E)",
                "Beneficiary Feedback Collection",
                "Community Needs Assessment",
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
              Plan Your Next Project
            </h3>
            <p className="mb-6 text-sm text-[#64748B]">
              Get reliable field data to make informed decisions for your next
              development project.
            </p>
            <Link
              href="/request"
              className="inline-block w-full rounded-lg bg-[#102A43] px-6 py-3 text-center font-semibold text-white transition-all hover:bg-[#1a3c5c]"
            >
              Request Field Data
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
