
import OnboardingForm from "../../components/forms/OnboardingForm";

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Onboarding Form</h2>
      <OnboardingForm slug="loanapp" />
    </div>
  );
}
