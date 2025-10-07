"use client";

import React, { useEffect, useState } from "react";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";
import { useRouter } from "next/navigation";

interface DynamicFormRendererProps {
  slug?: string; // Fetch form from backend if provided
  formData?: FormSchema; // Render from static data if provided
}

interface FormSchemaField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  multiple?: boolean;
  options?: string[];
}

interface FormSchema {
  name: string;
  description?: string;
  schema?: {
    fields?: FormSchemaField[];
  };
}

export default function DynamicFormRenderer({
  slug,
  formData,
}: DynamicFormRendererProps) {
  const [form, setForm] = useState<FormSchema | null>(formData || null);
  const [loading, setLoading] = useState(!formData);
  const router = useRouter();

  useEffect(() => {
    // Skip fetch if formData is passed
    if (!slug || formData) return;

    async function fetchForm() {
      try {
        const res = await fetch(`${DJANGO_API_ENDPOINT}/forms/${slug}/`);
        if (!res.ok) throw new Error(`Failed to fetch form: ${res.status}`);
        const data = await res.json();
        setForm(data);
      } catch (error) {
        console.error("Error fetching form:", error);
        setForm(null);
      } finally {
        setLoading(false);
      }
    }

    fetchForm();
  }, [slug, formData]);

  if (loading) return <p className="text-center mt-10">Loading form...</p>;
  if (!form) return <p className="text-center mt-10 text-red-600">Form not found.</p>;

  // 🧩 Handle form submission
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formDataObj = new FormData(target);

    const payloadObj: Record<string, any> = {};
    const fd = new FormData();

    // Extract fields (non-files)
    formDataObj.forEach((v, k) => {
      const element = target.elements.namedItem(k) as HTMLInputElement | null;
      if (element && element.type === "file") return;
      if (payloadObj[k] === undefined) payloadObj[k] = v;
      else {
        if (!Array.isArray(payloadObj[k])) payloadObj[k] = [payloadObj[k]];
        payloadObj[k].push(v);
      }
    });

    // Add JSON payload
    fd.append("payload", JSON.stringify(payloadObj));

    // Append file fields
    const fileInputs = target.querySelectorAll('input[type="file"]');
    fileInputs.forEach((inpEl) => {
      const inp = inpEl as HTMLInputElement;
      const name = inp.name;
      const files = inp.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          fd.append(name, files[i]);
        }
      }
    });

    try {
      const res = await fetch(`${DJANGO_API_ENDPOINT}/forms/${slug}/submit/`, {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        router.push("/onboarding/success");
      } else {
        router.push("/onboarding/error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      router.push("/onboarding/error");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-2 text-gray-800">{form.name}</h2>
      {form.description && (
        <p className="mb-4 text-gray-500">{form.description}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {form.schema?.fields?.map((f, idx) => {
          if (!f) return null;
          const key = f.name || `field_${idx}`;

          switch (f.type) {
            case "file":
              return (
                <div key={key}>
                  <label className="block mb-1 font-medium text-gray-700">
                    {f.label}
                  </label>
                  <input
                    name={key}
                    type="file"
                    multiple={!!f.multiple}
                    className="block w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              );

            case "dropdown":
              return (
                <div key={key}>
                  <label className="block mb-1 font-medium text-gray-700">
                    {f.label}
                  </label>
                  <select
                    name={key}
                    defaultValue=""
                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                  >
                    <option value="" disabled>
                      Choose...
                    </option>
                    {(f.options || []).map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );

            case "checkbox":
              return (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    name={key}
                    type="checkbox"
                    value="true"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="text-gray-700">{f.label}</label>
                </div>
              );

            default:
              return (
                <div key={key}>
                  <label className="block mb-1 font-medium text-gray-700">
                    {f.label}
                  </label>
                  <input
                    name={key}
                    required={!!f.required}
                    type={
                      f.type === "number"
                        ? "number"
                        : f.type === "email"
                        ? "email"
                        : "text"
                    }
                    className="border border-gray-300 rounded-md px-2 py-1 w-full"
                  />
                </div>
              );
          }
        })}

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
