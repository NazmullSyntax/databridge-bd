export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white px-6 pt-32 pb-20">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold text-[#102A43]">
          Terms & Conditions
        </h1>
        <div className="prose prose-slate max-w-none space-y-6 text-[#64748B]">
          <p>Last updated: November 2026</p>
          <p>
            Please read these Terms and Conditions carefully before using the
            DataBridge BD platform.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-bold text-[#102A43]">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using our services, you agree to be bound by these
            terms.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-bold text-[#102A43]">
            2. Services
          </h2>
          <p>
            DataBridge BD provides managed data collection and research
            services. We reserve the right to refuse service if a project
            violates ethical or legal standards.
          </p>

          <h2 className="mt-8 mb-4 text-2xl font-bold text-[#102A43]">
            3. Payments & Refunds
          </h2>
          <p>
            Payment terms are agreed upon in the project proposal. Refund
            policies are subject to the specific terms of each project.
          </p>
        </div>
      </div>
    </div>
  )
}
