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

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body: RegisterInput = await request.json();
  const { email, name, lastName, password, role } = body;
  if (!email || !name || !lastName || !password || !role) {
    return NextResponse.json(
      { error: "Faltan campos requeridos" },
      { status: 400 }
    );
  }

  if (name.length > 20 || lastName.length > 20) {
    return NextResponse.json(
      { error: "El nombre y apellido no pueden tener más de 20 caracteres" },
      { status: 400 }
    );
  }

  if (!email.match(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi)) {
    return NextResponse.json(
      { error: "El email no es válido" },
      { status: 400 }
    );
  }

  if (
    !password.match(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
    )
  ) {
    return NextResponse.json(
      {
        error:
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial.",
      },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
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

    // const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      {
        user: user,
        message: "Usuario creado exitosamente.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al crear usuario." },
      { status: 500 }
    );
  }
}
