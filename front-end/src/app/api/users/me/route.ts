import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const response = await fetch(`${process.env.BACKEND_URL}/users/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return NextResponse.json({ message: "Token inválido" }, { status: 401 });
  }

  const user = await response.json();

  return NextResponse.json({
    user,
  });
}
