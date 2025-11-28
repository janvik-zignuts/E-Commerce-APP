import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { fullName, email, password } = body;

  // Mock fallback registration — replace with DB later
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  // Simulate DB insert
  return NextResponse.json(
    { success: true, message: "User created via API fallback" },
    { status: 200 }
  );
}