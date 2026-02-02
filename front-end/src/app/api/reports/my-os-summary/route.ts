import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const url = new URL(req.url);
    const query = url.searchParams.toString();

    const res = await fetch(
      `${process.env.BACKEND_URL}/reports/my-os/summary?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Erro" },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
