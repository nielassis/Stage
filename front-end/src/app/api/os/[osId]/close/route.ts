import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST(
  _req: Request,
  { params }: { params: { osId: string } },
) {
  const { osId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${BACKEND_URL}/os/${osId}/close`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(res);

  return Response.json(await res.json(), { status: res.status });
}
