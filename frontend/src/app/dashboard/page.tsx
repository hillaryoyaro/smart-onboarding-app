export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600">
        Manage forms, view submissions, and share onboarding links with clients.
      </p>
      <div className="mt-6 flex gap-4">
        <a
          href="/dashboard/forms"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Manage Forms
        </a>
        <a
          href="/dashboard/submissions"
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          View Submissions
        </a>
      </div>
    </div>
  );
}
