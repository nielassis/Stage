import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ data: [], pagination: {} }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 10);
    const name = url.searchParams.get("name") || "";
    const email = url.searchParams.get("email") || "";
    const role = url.searchParams.get("role") || "";

    const backendParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
    });

    const res = await fetch(
      `${process.env.BACKEND_URL}/users?${backendParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { data: [], pagination: {} },
        { status: res.status },
      );
    }

    const json = await res.json();

    return NextResponse.json({
      data: json.data || [],
      pagination: json.pagination || {
        page,
        limit,
        total: json.total || 0,
        totalPages: Math.ceil((json.total || 0) / limit),
      },
    });
  } catch (err) {
    console.error("Erro ao buscar usuários:", err);
    return NextResponse.json({ data: [], pagination: {} }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const response = await fetch(`${process.env.BACKEND_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { message: data.message ?? "Erro ao criar usuário" },
      { status: response.status },
    );
  }

  return NextResponse.json(data);
}
