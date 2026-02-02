import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ osId: string; userId: string }> },
) {
  const { osId, userId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${BACKEND_URL}/os/${osId}/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return Response.json(await res.json(), { status: res.status });
}
