import { CartItem } from "@/app/lib/auth/types";
import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { params } = context;

    const body = await request.json();
    const { items } = body;

    if (!params?.id) {
      return NextResponse.json(
        { error: "ID de usuario no proporcionado" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No se enviaron productos para la venta" },
        { status: 400 }
      );
    }

    const invalidItems = items.filter((item: CartItem) => item.quantity < 3);
    if (invalidItems.length > 0) {
      return NextResponse.json(
        { error: "La cantidad mínima por producto es 3 unidades" },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const sale = await prisma.$transaction(async (tx) => {
      const newSale = await tx.sale.create({
        data: {
          userId: params.id,
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.price * item.quantity,
            })),
          },
          total,
        },
        include: {
          items: true,
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newSale;
    });

    return NextResponse.json(sale, { status: 200 });
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: "Error al crear la venta" },
      { status: 500 }
    );
  }
}
