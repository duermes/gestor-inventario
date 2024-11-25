import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period");
    const action = searchParams.get("action");

    if (!period) {
      return NextResponse.json(
        { error: "Parámetro de periodo no proporcionado" },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: "Parámetro de acción no proporcionado" },
        { status: 400 }
      );
    }

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

    const products = await prisma.logs.findMany({
      where: {
        action,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error en reporte de logs:", error);
    return NextResponse.json(
      { error: "Error al generar el reporte" },
      { status: 500 }
    );
  }
}
