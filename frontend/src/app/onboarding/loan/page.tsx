"use client";

import { useEffect, useState } from "react";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";

import LoanForm from "@/components/forms/LoanForm";

export default function KycPage() {
  const [formConfig, setFormConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const slug = "loanform";

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await fetch(`${DJANGO_API_ENDPOINT}/forms/${slug}/`);
        if (!response.ok) {
          throw new Error("Failed to fetch Loan form");
        }
        const data = await response.json();
        setFormConfig(data);
      } catch (error) {
        console.error("Error fetching Loan form:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading Loan form...</p>;
  }

  if (!formConfig) {
    return (
      <p className="text-center mt-10 text-red-500">
        Could not load Loan form. Please try again later.
      </p>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <LoanForm slug={slug} />
    </div>
  );
}
