import { NextResponse } from "next/server";

export async function POST() {
  // En producción, limpiarías las cookies o tokens aquí.
  return NextResponse.json({ message: "Sesión cerrada" });
}
