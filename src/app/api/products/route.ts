import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const body = await req.json();
  const { name, description, category, material, size, color, price, stock } =
    body;

  if (!userId) {
    return NextResponse.json(
      { error: "Usuario no proporcionado" },
      { status: 400 }
    );
  }
  if (!name || !category || !material || !size || !color || !price || !stock) {
    return NextResponse.json(
      {
        error:
          "Faltan campos requeridos (nombre, categoria, material, talla, color, precio, stock).",
      },
      { status: 400 }
    );
  }
  if (price <= 0 || stock < 0) {
    return NextResponse.json(
      {
        error:
          "El precio no puede ser igual o menor a 0 y el stock no puede ser menor a 0.",
      },
      { status: 400 }
    );
  }

  if (name.length > 20) {
    return NextResponse.json(
      {
        error: "El nombre no puede tener más de 20 caracteres.",
      },
      { status: 400 }
    );
  }

  if (size.length > 10) {
    return NextResponse.json(
      {
        error: "La talla no puede tener más de 10 caracter.",
      },
      { status: 400 }
    );
  }

  if (description && description.length > 10) {
    return NextResponse.json(
      {
        error: "La descripción no puede tener más de 10 caracteres.",
      },
      { status: 400 }
    );
  }
  try {
    const product = await prisma.product.create({
      data: {
        name,
        ...(description && { description }),
        category,
        material,
        size,
        color,
        price: parseFloat(price),
        ...(stock && { stock: parseInt(stock) }),
      },
    });

    await prisma.logs.create({
      data: {
        userId,
        action: "NUEVO_PRODUCTO",
        productId: product.id,
        productName: product.name,
        quantity: product.stock,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}
