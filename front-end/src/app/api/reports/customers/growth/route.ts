import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const res = await fetch(
    `${process.env.BACKEND_URL}/reports/customers/growth?${searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { message: data.message ?? "Erro no relatório" },
      { status: res.status },
    );
  }

  return NextResponse.json(data);
}
