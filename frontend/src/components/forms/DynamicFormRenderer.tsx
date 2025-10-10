"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";

export default function DynamicFormRenderer({
  formConfig,
  slug,
}: {
  formConfig: any;
  slug: string;
}) {
  const router = useRouter();

  // ✅ Guard: Ensure formConfig exists
  if (!formConfig) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Form not found 😢</p>
      </div>
    );
  }

  // ✅ Safely extract schema and fields
  const schema = formConfig.schema || {};
  const fields = schema.fields || [];

  // ✅ Handle empty fields
  if (fields.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No fields found for this form 😕</p>
      </div>
    );
  }

  // ✅ Dynamically generate Zod schema
  const fieldSchema = fields.reduce((acc: any, field: any) => {
    if (field.required) {
      acc[field.name] = z.string().min(1, `${field.label} is required`);
    } else {
      acc[field.name] = z.string().optional();
    }
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

  // ✅ Handle form submission
  const onSubmit = async (data: any) => {
    try {
      const response = await fetch(`${DJANGO_API_ENDPOINT}/forms/${slug}/submit/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("✅ Form submitted successfully!");
        reset();
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
              <Textarea
                {...register(field.name)}
                placeholder={field.placeholder}
              />
            ) : field.type === "select" ? (
              <select
                {...register(field.name)}
                className="w-full border rounded-md p-2"
              >
                <option value="">Select...</option>
                {field.options?.map((option: string) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
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

        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
