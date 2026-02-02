import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ osId: string; id: string }> },
) {
  const { id, osId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(
    `${BACKEND_URL}/os/${osId}/stages/${id}/request-approval`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();
  return Response.json(data, { status: res.status });
}
