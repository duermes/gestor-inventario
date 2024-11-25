import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  await prisma.product
    .findUnique({
      where: { id: params.id },
    })
    .then((res) => {
      if (!res) {
        return NextResponse.json(
          {
            error: "Producto no encontrado.",
          },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          res,
        },
        { status: 200 }
      );
    })
    .catch(() => {
      return NextResponse.json(
        {
          error: "Ha ocurrido un error encontrando el producto",
        },
        { status: 500 }
      );
    });
}

export async function PATCH(req: Request, context: { params: { id: string } }) {
  try {
    const { params } = context;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const body = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Parámetro de usuario no proporcionado" },
        { status: 400 }
      );
    }
    const { name, description, category, material, size, color, price, stock } =
      body;
    if (
      !name ||
      !category ||
      !material ||
      !size ||
      !color ||
      !price ||
      !stock
    ) {
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
          error: "La talla no puede tener más de 10 caracteres.",
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

    const currentProduct = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!currentProduct) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id: params.id },
        data: body,
      });
      if (currentProduct.isActive !== updatedProduct.isActive) {
        await tx.logs.create({
          data: {
            userId: userId,
            action: updatedProduct.isActive
              ? "ACTIVAR_PRODUCTO"
              : "RETIRAR_PRODUCTO",
            productId: updatedProduct.id,
            productName: updatedProduct.name,
            description: `Estado cambiado a ${
              updatedProduct.isActive ? "activo" : "inactivo"
            }`,
          },
        });
      }

      if (currentProduct.stock !== updatedProduct.stock) {
        await tx.logs.create({
          data: {
            userId,
            action: "INVENTARIO",
            productId: updatedProduct.id,
            productName: updatedProduct.name,
            quantity: updatedProduct.stock - currentProduct.stock,
            description: `Stock actualizado de ${currentProduct.stock} a ${updatedProduct.stock}`,
          },
        });
      }

      return updatedProduct;
    });
    return NextResponse.json(
      { message: "Producto actualizado exitosamente." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { params } = context;
    const { searchParams } = new URL(req.url);
    const toDelete = searchParams.get("delete");
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Parámetro de usuario no proporcionado" },
        { status: 400 }
      );
    }

    if (toDelete !== "true") {
      return NextResponse.json(
        { error: "El parámetro 'delete' debe ser 'true'." },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "Producto no encontrado.",
        },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.saleItem.deleteMany({
        where: { productId: params.id },
      });

      await tx.logs.deleteMany({
        where: { productId: params.id },
      });

      await tx.logs.create({
        data: {
          userId: userId,
          action: "ELIMINAR_PRODUCTO",
          productId: params.id,
          productName: product.name,
        },
      });

      await tx.product.delete({
        where: { id: params.id },
      });
    });

    return NextResponse.json(
      {
        message: "Producto eliminado exitosamente.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      {
        error: "Error al eliminar producto",
      },
      { status: 500 }
    );
  }
}
