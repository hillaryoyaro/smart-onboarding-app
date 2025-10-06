export default function Home() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Smart Onboarding</h1>
      <p className="text-gray-600">Create forms, collect submissions and notify admins.</p>
      <div className="mt-6 flex gap-4">
        <a href="/onboarding" className="text-blue-600 underline">Start Onboarding</a>
        <a href="/auth/register" className="text-blue-600 underline">Register</a>
      </div>
    </div>
  );
}
