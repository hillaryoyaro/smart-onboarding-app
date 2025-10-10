import { formRegistry } from "@/config/forms";
import DynamicFormRenderer from "@/components/forms/DynamicFormRenderer";

export default function OnboardingSlugPage({ params }: { params: { slug: string } }) {
  const formConfig = formRegistry[params.slug];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <DynamicFormRenderer slug={params.slug} formConfig={formConfig} />
    </main>
  );
}
