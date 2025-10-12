"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";
import ApiProxy from "@/lib/api";

interface Field {
  key: string;
  label: string;
  type: string;
  required?: boolean;
}

interface FormSchema {
  id: string;
  name: string;
  slug: string;
  description?: string;
  schema: {
    fields: Field[];
  };
}

type FileMap = {
  [key: string]: FileList;
};

export default function KycForm({ slug = "kycform" }: { slug?: string }) {
  const router = useRouter();
  const [formConfig, setFormConfig] = useState<FormSchema | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<FileMap>({});
  const [loading, setLoading] = useState(true);

  // Fetch KYC form schema
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${DJANGO_API_ENDPOINT}/forms/${slug}/`);
        if (!res.ok) throw new Error("Failed to fetch form config");
        const data = await res.json();
        setFormConfig(data);

        // Initialize empty values
        const initialValues: Record<string, string> = {};
        data.schema.fields.forEach((f: Field) => {
          initialValues[f.key] = "";
        });
        setValues(initialValues);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, [slug]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles((prev) => ({ ...prev, [e.target.name]: e.target.files }));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("payload", JSON.stringify(values));

    Object.entries(files).forEach(([key, fileList]) => {
      Array.from(fileList).forEach((file) => fd.append(key, file));
    });

    const { status } = await ApiProxy.post(`/forms/${slug}/submit/`, fd, false, true);

    if (status === 201) {
      router.push("/onboarding/success");
    } else {
      alert("Submission failed. Please try again.");
    }
  }

  if (loading)
    return <p className="text-center text-gray-500 py-10">Loading KYC form...</p>;

  if (!formConfig)
    return <p className="text-center text-red-500 py-10">Form not found.</p>;

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-4">{formConfig.name}</h2>
      {formConfig.description && (
        <p className="text-gray-600 mb-6">{formConfig.description}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {formConfig.schema.fields.map((field: Field) => (
          <div key={field.key} className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === "file" ? (
              <input
                type="file"
                name={field.key}
                onChange={onFileChange}
                className="border p-2 rounded"
                multiple={false}
              />
            ) : (
              <input
                type={field.type}
                name={field.key}
                value={values[field.key] || ""}
                onChange={onChange}
                className="border p-2 rounded"
                required={field.required}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
