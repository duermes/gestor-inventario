// obtener todos los usuarios

import { RegisterInput } from "@/app/lib/auth/types";
import prisma from "@/app/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: "Error al obtener usuarios", error },
      { status: 500 }
    );
  }
}

// Crear un usuario
export async function POST(request: Request) {
  const body: RegisterInput = await request.json();
  const { email, name, lastName, password, role } = body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    if (!email || !name || !lastName || !password || !role) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        lastName,
        password: hashedPassword,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      {
        user: userWithoutPassword,
        message: "Usuario creado exitosamente.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error al crear usuario.", error },
      { status: 500 }
    );
  }
}
