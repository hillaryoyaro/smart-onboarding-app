// frontend/src/config/defaults.js
export const DJANGO_BASE_URL = process.env.NEXT_PUBLIC_DJANGO_BASE_URL || "http://localhost:8000";
export const DJANGO_API_ENDPOINT = `${DJANGO_BASE_URL}/api`;
export const SITE_NAME = "OnboardingApp";