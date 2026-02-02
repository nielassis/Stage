import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json([], { status: 401 });
  }

  const res = await fetch(
    `${process.env.BACKEND_URL}/reports/os-stages/timeline`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  console.log(res);

  if (!res.ok) {
    return NextResponse.json([], { status: 200 });
  }

  const json = await res.json();
  return NextResponse.json(json);
}
