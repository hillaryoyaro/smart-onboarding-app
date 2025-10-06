export default function Navbar(){
  return (
    <nav className="bg-white shadow p-3 mb-6">
      <div className="max-w-4xl mx-auto flex justify-between">
        <a href="/" className="font-bold">OnboardingApp</a>
        <div className="space-x-4">
          <a href="/onboarding">Onboarding</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/auth/login">Login</a>
        </div>
      </div>
    </nav>
  )
}
