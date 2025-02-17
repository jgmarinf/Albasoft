import { registerAdmin, registerUser } from "@/actions/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { role, name, email, password, adminEmail, claveSecreta } =
      await request.json();

    // Validación básica
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Nombre inválido o faltante" },
        { status: 400 }
      );
    }

    let result;
    if (role === "admin") {
      result = await registerAdmin({
        name,
        email,
        password,
        claveSecreta: claveSecreta || "", // Valor por defecto
      });
    } else {
      result = await registerUser({
        name,
        email,
        password,
        adminEmail: adminEmail || "", // Valor por defecto
      });
    }

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en el endpoint de registro:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
