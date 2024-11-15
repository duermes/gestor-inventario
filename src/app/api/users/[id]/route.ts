import prisma from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
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

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    NextResponse.json(
      { error: "Ha ocurrido un error al obtener el usuario", message: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const id = params.id;
  const { searchParams } = new URL(request.url);
  const toDelete = searchParams.get("delete");
  if (toDelete === "true") {
    try {
      await prisma.user.delete({
        where: { id },
      });

      return NextResponse.json(
        {
          message: "Usuario eliminado exitosamente",
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Error al eliminar usuario" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Borrar el usuario no es true" },
      { status: 400 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { params } = context;
    const user = await prisma.user.update({
      where: { id: params.id },
      data: body,
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
    return NextResponse.json({
      user,
      message: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar datos en el usuario" },
      { status: 400 }
    );
  }
}
