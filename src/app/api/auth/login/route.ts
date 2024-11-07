import { NextResponse } from "next/server";
import prisma from "../../../lib/db";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo electrónico y contraseña son requeridos" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciales inválidas (usuario no encontrado)" },
        { status: 401 }
      );
    }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Contraseña inválidas" },
        { status: 401 }
      );
    }

    // No enviar la contraseña en la respuesta
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Inicio de sesión exitoso",
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
