export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <div className="p-8 bg-white shadow rounded-md text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-3">⚠️ Error</h2>
        <p className="text-gray-600 mb-4">
          Something went wrong while submitting your form. Please try again later.
        </p>
        <a
          href="/dashboard"
          className="text-blue-600 hover:underline"
        >
          Go back to onboarding
        </a>
      </div>
    </div>
  );
}
