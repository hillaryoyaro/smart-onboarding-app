"use client";

import { useState, useEffect } from "react";
import DynamicFormRenderer from "@/components/forms/DynamicFormRenderer";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";

export default function KycFormPage() {
  const [formConfig, setFormConfig] = useState<any>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const res = await fetch(`${DJANGO_API_ENDPOINT}/forms/kyc_form/`);
      if (res.ok) {
        const data = await res.json();
        setFormConfig(data);
      } else {
        console.error("Failed to fetch KYC form config");
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="py-10">
      {formConfig ? (
        <DynamicFormRenderer formConfig={formConfig} slug="kyc_form" />
      ) : (
        <p className="text-center text-gray-500">Loading KYC form...</p>
      )}
    </div>
  );
}
