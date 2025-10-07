// /app/onboarding/page.tsx
"use client";

import DynamicFormRenderer from "@/components/forms/DynamicFormRenderer";

const mockForm = {
  name: "Employee Onboarding",
  description: "Please fill in your personal details.",
  schema: {
    fields: [
      { name: "full_name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "age", label: "Age", type: "number" },
      {
        name: "department",
        label: "Department",
        type: "dropdown",
        options: ["Engineering", "Finance", "HR"],
      },
      { name: "resume", label: "Upload Resume", type: "file" },
    ],
  },
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <DynamicFormRenderer formData={mockForm} />
    </div>
  );
}
