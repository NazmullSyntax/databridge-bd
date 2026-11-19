import {
  Search,
  FileText,
  CheckCircle2,
  Database,
  BarChart,
  Package,
} from "lucide-react"

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <Search />,
      title: "Tell Us What You Need",
      desc: "Submit your data requirements using our simple request wizard.",
    },
    {
      icon: <FileText />,
      title: "We Review & Propose",
      desc: "Our team reviews your needs and sends a customized research proposal.",
    },
    {
      icon: <CheckCircle2 />,
      title: "Confirm Your Project",
      desc: "Accept the proposal and confirm the project timeline and budget.",
    },
    {
      icon: <Database />,
      title: "Data Collection",
      desc: "Our field researchers collect data using ethical and verified methods.",
    },
    {
      icon: <BarChart />,
      title: "Verification & Analysis",
      desc: "We clean, verify, and analyze the data to ensure high quality.",
    },
    {
      icon: <Package />,
      title: "Receive Deliverables",
      desc: "Get your final dataset, reports, or dashboards via the customer portal.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="relative overflow-hidden bg-[#061A35] pt-32 pb-20 text-center">
        <div className="pointer-events-none absolute top-0 left-1/2 h-100 w-200 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            How It <span className="text-gradient">Works</span>
          </h1>
          <p className="text-lg text-gray-400">
            A transparent, step-by-step process to get the data you need.
          </p>
        </div>
      </section>

      <section className="relative z-20 mx-auto -mt-10 max-w-5xl px-6 py-20">
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-start gap-6 rounded-xl border border-[#E2E8F0] bg-white p-6 transition-all hover:shadow-md md:flex-row md:items-center md:p-8"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-2xl text-cyan-600">
                {step.icon}
              </div>
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <span className="text-sm font-bold text-cyan-600">
                    STEP {i + 1}
                  </span>
                  <h3 className="text-xl font-bold text-[#102A43]">
                    {step.title}
                  </h3>
                </div>
                <p className="text-[#64748B]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
