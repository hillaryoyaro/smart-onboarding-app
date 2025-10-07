"use client";
import { useParams } from "next/navigation";
import DynamicFormRenderer from "@/components/forms/DynamicFormRenderer";

export default function OnboardingFormPage() {
  const { slug } = useParams(); // e.g., /onboarding/kyc → slug = "kyc"

  return (
    <div className="p-6">
      <DynamicFormRenderer slug={slug as string} />
    </div>
  );
}
