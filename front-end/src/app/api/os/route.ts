import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${BACKEND_URL}/os?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return Response.json(await res.json(), { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${BACKEND_URL}/customers/${body.customerId}/os`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return Response.json(await res.json(), { status: res.status });
}
