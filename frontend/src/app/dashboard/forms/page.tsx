"use client";

import React, { useEffect, useState } from "react";
import { DJANGO_API_ENDPOINT } from "@/config/defaults";

export default function FormsListPage() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    async function fetchForms() {
      try {
        const res = await fetch(`${DJANGO_API_ENDPOINT}/forms/`);
        if (res.ok) {
          const data = await res.json();
          setForms(data);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchForms();
  }, []);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/onboarding/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  if (loading) return <p>Loading forms...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Forms</h1>
      {forms.length === 0 ? (
        <p>No forms yet. Create one!</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Slug</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form: any) => (
              <tr key={form.id}>
                <td className="p-2 border">{form.name}</td>
                <td className="p-2 border">{form.slug}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => handleCopyLink(form.slug)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    {copiedSlug === form.slug ? "Copied!" : "Copy Link"}
                  </button>
                  <a
                    href={`/onboarding/${form.slug}`}
                    className="bg-gray-700 text-white px-3 py-1 rounded"
                    target="_blank"
                  >
                    Preview
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
