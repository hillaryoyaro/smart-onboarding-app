// frontend/src/app/api/proxy/route.ts
import { NextResponse } from "next/server";

const DJANGO_BASE = process.env.NEXT_PUBLIC_DJANGO_BASE_URL || "http://localhost:8000";

export async function POST(req) {
  try {
    const body = await req.json();
    const { endpoint, ...payload } = body;
    if (!endpoint) return NextResponse.json({ error: "missing endpoint" }, { status: 400 });

    const res = await fetch(`${DJANGO_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
