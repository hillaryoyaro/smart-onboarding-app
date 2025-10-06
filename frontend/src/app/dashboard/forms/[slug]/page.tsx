// frontend/src/app/forms/[slug]/page.tsx
import DynamicFormRenderer from "@/components/forms/DynamicFormRenderer";

export default function Page({ params }) {
  const { slug } = params;
  return <DynamicFormRenderer slug={slug} />;
}
