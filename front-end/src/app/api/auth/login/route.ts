import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "Credenciais inválidas" },
      { status: 401 },
    );
  }

  const data = await response.json();

  const nextResponse = NextResponse.json({
    user: data.user,
  });

  nextResponse.cookies.set({
    name: "auth_token",
    value: data.token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return nextResponse;
}
