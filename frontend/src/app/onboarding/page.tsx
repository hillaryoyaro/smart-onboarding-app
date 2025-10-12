"use client";

import { useEffect, useState } from "react";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";
import DynamicFormRenderer from "@/components/forms/DynamicFormRenderer";
import OnboardingForm from "@/components/forms/OnboardingForm";

export default function OnboardingPage() {
  const [formConfig, setFormConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const slug = "onboarding";

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`${DJANGO_API_ENDPOINT}/forms/${slug}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch form");
        }
        const data = await response.json();
        setFormConfig(data);
      } catch (error) {
        console.error("Error fetching form:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading form...</p>;
  }

  return (
    <div className="container mx-auto">
      <OnboardingForm slug={slug} />
    </div>
  );
}
