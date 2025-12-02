import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, fullName, email, password } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Request type is required" },
        { status: 400 }
      );
    }

    // --- REGISTER ---
    if (type === "register") {
      if (!email || !password) {
        return NextResponse.json(
          { error: "Email and password are required" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: true, message: "User registered successfully" },
        { status: 200 }
      );
    }

    // --- LOGIN ---
    if (type === "login") {
      if (email === "user@fashionhub.com" && password === "fashion123") {
        return NextResponse.json(
          { success: true, message: "Login successful" },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // If invalid type is passed
    return NextResponse.json(
      { error: "Invalid request type" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
