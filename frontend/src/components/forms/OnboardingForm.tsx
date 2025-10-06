"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ApiProxy from "@/lib/api";

interface FormValues {
  full_name: string;
  email: string;
}

type FileMap = {
  [key: string]: FileList;
};

export default function OnboardingForm({ slug = "loanapp" }: { slug?: string }) {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>({ full_name: "", email: "" });
  const [files, setFiles] = useState<FileMap>({});

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setValues((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles((s) => ({ ...s, [e.target.name]: e.target.files! }));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("payload", JSON.stringify(values));

    Object.entries(files).forEach(([key, fileList]) => {
      Array.from(fileList).forEach((f) => fd.append(key, f));
    });

    const { status } = await ApiProxy.post(`/forms/${slug}/submit/`, fd, false, true);

    if (status === 201) router.push("/onboarding/success");
    else alert("Submission failed");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-sm">Full name</label>
        <input
          name="full_name"
          value={values.full_name}
          onChange={onChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm">Email</label>
        <input
          name="email"
          type="email"
          value={values.email}
          onChange={onChange}
          className="border p-2 w-full rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm">Upload document (optional)</label>
        <input
          name="id_doc"
          type="file"
          onChange={onFileChange}
          className="border p-2 w-full rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
