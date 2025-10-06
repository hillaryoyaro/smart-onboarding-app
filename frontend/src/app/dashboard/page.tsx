"use client";
import { useEffect, useState } from "react";
import ApiProxy from "../../lib/api";


export default function DashboardPage() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    async function load() {
      const { data, status } = await ApiProxy.get("/submissions/", true);
      if (status === 200) setSubmissions(data.results || data);
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard — Submissions</h2>
      {submissions.length === 0 ? <p>No submissions yet.</p> : (
        <ul className="space-y-3">
          {submissions.map((s) => (
            <li key={s.id} className="border p-3 rounded">
              <div><strong>Form:</strong> {s.form}</div>
              <div><strong>Data:</strong> <pre>{JSON.stringify(s.data, null, 2)}</pre></div>
              <div><strong>Created:</strong> {s.created_at}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
