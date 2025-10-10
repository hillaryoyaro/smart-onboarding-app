import Link from "next/link";
export default function BrandLink({ displayName = true }) {
  return (
    <Link href="/" className="font-bold text-lg">
      OnboardingApp {displayName ? "" : ""}
    </Link>
  );
}
