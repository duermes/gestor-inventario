import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    switch (period) {
      case "weekly":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "monthly":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "yearly":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    if (!period) {
      return NextResponse.json(
        { error: "Parámetro de periodo no proporcionado" },
        { status: 400 }
      );
    }
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (sales.length === 0) {
      return NextResponse.json(
        { error: "No hay ventas en el periodo seleccionado" },
        { status: 400 }
      );
    }

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error en reporte de ventas");
    return NextResponse.json(
      { error: "Error al generar el reporte" },
      { status: 500 }
    );
  }
}
