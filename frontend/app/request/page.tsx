"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Upload } from "lucide-react";

export default function RequestWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const steps = [
    { id: 1, title: "Service", icon: "1" },
    { id: 2, title: "Details", icon: "2" },
    { id: 3, title: "Location", icon: "3" },
    { id: 4, title: "Requirements", icon: "4" },
    { id: 5, title: "Review", icon: "5" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="bg-[#061A35] p-6">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                    step >= s.id
                      ? "bg-cyan-500 text-black"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {step > s.id ? <Check size={16} /> : s.id}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    step >= s.id ? "text-white" : "text-gray-500"
                  } hidden sm:block`}
                >
                  {s.title}
                </span>
                {i < steps.length - 1 && (
                  <div className="w-8 md:w-16 h-0.5 bg-white/10 mx-2 md:mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-[#102A43] mb-6">
                What do you need help with?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Market Research",
                  "Field Data Collection",
                  "Survey & Questionnaire",
                  "Data Analysis",
                ].map((service) => (
                  <label
                    key={service}
                    className="border border-[#E2E8F0] rounded-lg p-4 cursor-pointer hover:border-cyan-500 hover:bg-cyan-50 transition-all flex items-center gap-3"
                  >
                    <input
                      type="radio"
                      name="service"
                      className="w-4 h-4 text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-sm font-medium text-[#102A43]">
                      {service}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-[#102A43] mb-6">
                Tell us about your requirement
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#102A43] mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g. Market demand research for new product"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#102A43] mb-1">
                    What information do you need?
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500"
                    placeholder="Describe your requirements in your own words..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-[#102A43] mb-6">
                Where should the work take place?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#102A43] mb-1">
                    Division
                  </label>
                  <input
                    type="text"
                    className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g. Dhaka"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#102A43] mb-1">
                    District or Area
                  </label>
                  <input
                    type="text"
                    className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g. Mirpur"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-[#102A43] mb-6">
                Add requirements and documents
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#102A43] mb-1">
                    Timeline
                  </label>
                  <input
                    type="text"
                    className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g. 3 weeks"
                  />
                </div>
                <label className="border-2 border-dashed border-[#E2E8F0] rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-cyan-500 transition-colors">
                  <Upload className="text-cyan-600" />
                  <span className="text-sm font-medium text-[#102A43]">
                    Upload reference documents
                  </span>
                  <input type="file" multiple className="hidden" />
                </label>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-[#102A43] mb-6">
                Review your request
              </h2>
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-sm text-[#64748B]">
                Please review all information before submitting your request.
                You can use the Back button to update any step.
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-10 pt-6 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              className={`flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#102A43] ${
                step === 1 ? "invisible" : ""
              }`}
            >
              <ArrowLeft size={16} /> Back
            </button>
            <button
              type={step === totalSteps ? "submit" : "button"}
              onClick={() => setStep(Math.min(totalSteps, step + 1))}
              className="bg-[#102A43] hover:bg-[#1a3c5c] text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-all flex items-center gap-2"
            >
              {step === totalSteps ? "Submit Request" : "Next Step"}
              {step === totalSteps ? <Check size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
