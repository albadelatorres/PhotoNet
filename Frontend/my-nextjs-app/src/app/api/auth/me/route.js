import { NextResponse } from "next/server";

export async function GET(request) {
  const token = request.cookies.get("token")?.value;
  const username = request.cookies.get("username")?.value;
  const email = request.cookies.get("email")?.value;

  if (!token || !username || !email) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  return NextResponse.json({
    username,
    email,
  });
}

