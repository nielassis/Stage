import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ osId: string }> },
) {
  const { osId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${BACKEND_URL}/os/${osId}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return Response.json(await res.json(), { status: res.status });
}
