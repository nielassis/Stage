import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; userId: string } },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(
    `${BACKEND_URL}/os/${params.id}/users/${params.userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return Response.json(await res.json(), { status: res.status });
}
