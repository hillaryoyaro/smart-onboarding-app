export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="p-8 bg-white shadow rounded-md text-center">
        <h2 className="text-2xl font-bold text-green-700 mb-3">🎉 Success!</h2>
        <p className="text-gray-600 mb-4">
          Your Loan has been submitted successfully.
        </p>
        <a
          href="/onboarding/loan/"
          className="text-blue-600 hover:underline"
        >
          Need of Loan Again.Apply here
        </a>
      </div>
    </div>
  );
}
