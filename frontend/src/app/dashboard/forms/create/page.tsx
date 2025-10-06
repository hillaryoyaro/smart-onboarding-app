// frontend/src/app/dashboard/forms/create/page.tsx
"use client";
import { useState } from "react";
import FormFieldBuilder from "@/components/forms/FormFieldBuilder";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";
import { useRouter } from "next/navigation";

export default function CreateFormPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([]);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name,
      slug,
      description,
      schema: { fields: fields.map(f => {
        // normalize options if dropdown
        const out = {...f};
        if (out.options && typeof out.options === "string") {
          out.options = out.options.split(",").map(s=>s.trim()).filter(Boolean);
        }
        return out;
      })}
    };
    const res = await fetch(`${DJANGO_API_ENDPOINT}/forms/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/dashboard/forms/${data.slug}`);
    } else {
      alert("Create form failed");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Create Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} className="border p-2 w-full" required />
        <input placeholder="Slug (unique)" value={slug} onChange={(e)=>setSlug(e.target.value)} className="border p-2 w-full" required />
        <textarea placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} className="border p-2 w-full" />
        <div>
          <h3 className="font-semibold mb-2">Fields</h3>
          <FormFieldBuilder onChange={(f)=>setFields(f)} />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
      </form>
    </div>
  );
}
