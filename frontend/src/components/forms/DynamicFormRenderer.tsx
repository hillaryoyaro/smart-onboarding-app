"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";

interface DynamicFormRendererProps {
  formConfig: any;
  slug: string;
}

export default function DynamicFormRenderer({ formConfig, slug }: DynamicFormRendererProps) {
  const router = useRouter();
  const [fileInputs, setFileInputs] = useState<Record<string, FileList>>({});

  // ✅ Guard: Ensure formConfig exists
  if (!formConfig) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Form not found 😢</p>
      </div>
    );
  }

  const schema = formConfig.schema || {};
  const fields = schema.fields || [];

  if (fields.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No fields found for this form 😕</p>
      </div>
    );
  }

  // ✅ Dynamically generate Zod schema (non-file fields only)
  const fieldSchema = fields.reduce((acc: any, field: any) => {
    if (field.type === "file") return acc; // files handled separately
    if (field.required) acc[field.name] = z.string().min(1, `${field.label} is required`);
    else acc[field.name] = z.string().optional();
    return acc;
  }, {});

  const FormSchema = z.object(fieldSchema);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
  });

  // ✅ Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileInputs((prev) => ({ ...prev, [e.target.name]: e.target.files! }));
    }
  };

  // ✅ Handle form submission
  const onSubmit = async (values: Record<string, any>) => {
    const formData = new FormData();
    formData.append("payload", JSON.stringify(values));

    Object.entries(fileInputs).forEach(([key, files]) => {
      Array.from(files).forEach((file) => formData.append(key, file));
    });

    try {
      const response = await fetch(`${DJANGO_API_ENDPOINT}/forms/${slug}/submit/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        reset();
        alert("✅ Form submitted successfully!");
        router.push("/onboarding/success");
      } else {
        console.error(await response.text());
        alert("⚠️ Submission failed. Please try again.");
        router.push("/onboarding/error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      router.push("/onboarding/error");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-2xl mt-10">
      <h2 className="text-2xl font-semibold mb-2">{schema.title || formConfig.name}</h2>
      <p className="text-gray-600 mb-6">{schema.description || "Please fill in the form below."}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {fields.map((field: any) => (
          <div key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>

            {field.type === "textarea" ? (
              <Textarea {...register(field.name)} placeholder={field.placeholder} />
            ) : field.type === "select" ? (
              <select {...register(field.name)} className="w-full border rounded-md p-2">
                <option value="">Select...</option>
                {field.options?.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === "file" ? (
              <Input
                type="file"
                name={field.name}
                onChange={handleFileChange}
                className="w-full"
                multiple={field.multiple || false}
              />
            ) : (
              <Input
                type={field.type}
                placeholder={field.placeholder}
                {...register(field.name)}
              />
            )}

            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[field.name]?.message?.toString()}
              </p>
            )}
          </div>
        ))}

        <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
