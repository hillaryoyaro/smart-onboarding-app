"use client";

import OnboardingForm from "@/components/forms/OnboardingForm";

export default function CreateFormPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a New Form</h1>
      <OnboardingForm />
    </div>
  );
}
