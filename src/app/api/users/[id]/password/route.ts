import prisma from "@/app/lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = await context;

  try {
    const body = await request.json();
    const { password, newPassword } = await body;

    if (!password || !newPassword) {
      return NextResponse.json(
        { error: "Ambos campos son requeridos" },
        { status: 400 }
      );
    }
    if (password === newPassword) {
      return NextResponse.json(
        { error: "La nueva contraseña no puede ser igual a la actual" },
        { status: 400 }
      );
    }
    if (
      !newPassword.match(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
      )
    ) {
      return NextResponse.json(
        {
          error:
            "La nueva contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      select: {
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Ocurrio un error encontrando al usuario." },
        { status: 400 }
      );
    }
    console.log(user.password);
    console.log(password);

    const comparePasswords = await bcrypt.compare(newPassword, user.password);

    if (comparePasswords) {
      return NextResponse.json(
        { error: "La nueva contraseña no puede ser igual a la actual" },
        { status: 400 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log(`isValidPassword: ${isValidPassword}`);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Contraseña actual incorrecta." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Error al actualizar la contraseña." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Contraseña actualizada exitosamente." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Ha ocurrido un error al cambiar la contraseña." },
      { status: 500 }
    );
  }
}
