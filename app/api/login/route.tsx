import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  // Mock fallback login
  if (email === "user@fashionhub.com" && password === "fashion123") {
    return NextResponse.json({ success: true, fallback: true });
  }

  return NextResponse.json(
    { error: "Invalid credentials" },
    { status: 401 }
  );
}
