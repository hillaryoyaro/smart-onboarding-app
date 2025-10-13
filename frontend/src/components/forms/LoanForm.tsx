"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ApiProxy from "@/lib/api";

interface LoanValues {
  full_name: string;
  email: string;
  phone_number: string;
  kyc_reference_id: string;
  loan_amount: string;
  loan_term: string;
  loan_purpose: string;
  employment_status: string;
  monthly_income: string;
  collateral_description: string;
}

type FileMap = {
  [key: string]: FileList;
};

export default function LoanForm({ slug = "loanform" }: { slug?: string }) {
  const router = useRouter();

  const [values, setValues] = useState<LoanValues>({
    full_name: "",
    email: "",
    phone_number: "",
    kyc_reference_id: "",
    loan_amount: "",
    loan_term: "",
    loan_purpose: "",
    employment_status: "",
    monthly_income: "",
    collateral_description: "",
  });

  const [files, setFiles] = useState<FileMap>({});
  const [loading, setLoading] = useState(false);

  function onChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles((prev) => ({ ...prev, [e.target.name]: e.target.files! }));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("payload", JSON.stringify(values));

    Object.entries(files).forEach(([key, fileList]) => {
      Array.from(fileList).forEach((f) => fd.append(key, f));
    });

    const { status } = await ApiProxy.post(`/forms/${slug}/submit/`, fd, false, true);

    setLoading(false);
    if (status === 201) router.push("/onboarding/loan/success");
    else alert("Submission failed");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-4 p-6 bg-white shadow rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-2 text-gray-700">
        Loan Application Form
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Please fill out this form to apply for a loan. Ensure all details are correct.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name" name="full_name" value={values.full_name} onChange={onChange} required />
        <Input label="Email" name="email" type="email" value={values.email} onChange={onChange} required />
        <Input label="Phone Number" name="phone_number" value={values.phone_number} onChange={onChange} required />
        <Input label="KYC Reference ID" name="kyc_reference_id" value={values.kyc_reference_id} onChange={onChange} required />
        <Input label="Loan Amount (Ksh)" name="loan_amount" type="number" value={values.loan_amount} onChange={onChange} required />
        <Select
          label="Loan Term"
          name="loan_term"
          value={values.loan_term}
          onChange={onChange}
          options={["3 Months", "6 Months", "12 Months", "24 Months"]}
          required
        />
        <Textarea label="Loan Purpose" name="loan_purpose" value={values.loan_purpose} onChange={onChange} required />
        <Select
          label="Employment Status"
          name="employment_status"
          value={values.employment_status}
          onChange={onChange}
          options={["Employed", "Self-Employed", "Unemployed", "Student", "Retired"]}
          required
        />
        <Input label="Monthly Income (Ksh)" name="monthly_income" type="number" value={values.monthly_income} onChange={onChange} required />
        <Textarea
          label="Collateral Description"
          name="collateral_description"
          value={values.collateral_description}
          onChange={onChange}
          placeholder="Describe the asset or guarantee offered"
        />
        <FileInput label="Upload Supporting Document" name="supporting_doc" onChange={onFileChange} />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition w-full mt-6"
      >
        {loading ? "Submitting..." : "Submit Loan Application"}
      </button>
    </form>
  );
}

/* --- Reusable Field Components --- */

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="border p-2 w-full rounded"
      />
    </div>
  );
}

function Textarea({ label, name, value, onChange, required = false, placeholder = "" }: any) {
  return (
    <div className="col-span-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="border p-2 w-full rounded h-24"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options, required = false }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="border p-2 w-full rounded"
      >
        <option value="">Select...</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileInput({ label, name, onChange, required = false }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        required={required}
        className="border p-2 w-full rounded"
      />
    </div>
  );
}
