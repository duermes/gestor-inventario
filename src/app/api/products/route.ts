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
  const body = await req.json();
  const {
    name,
    description,
    category,
    material,
    size,
    color,
    price,
    imageUrl,
    stock,
  } = body;
  if (!name || !category || !material || !size || !color || !price) {
    return NextResponse.json(
      {
        error:
          "Faltan campos requeridos (nombre, categoria, material, talla, color, precio)",
      },
      { status: 400 }
    );
  }
  if (price <= 0) {
    return NextResponse.json(
      { error: "El precio debe ser mayor a 0" },
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
        price,
        ...(stock && { stock }),
        ...(imageUrl && { imageUrl }),
      },
    });
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}