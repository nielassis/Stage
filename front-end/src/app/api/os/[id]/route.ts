import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${BACKEND_URL}/os/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return Response.json(await res.json(), { status: res.status });
}
