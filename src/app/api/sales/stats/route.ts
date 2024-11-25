import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period");

    if (!period) {
      return NextResponse.json(
        { error: "Falta parametro periodo" },
        { status: 400 }
      );
    }

    if (!["daily", "weekly", "monthly"].includes(period)) {
      return NextResponse.json({ error: "Periodo no válido" }, { status: 400 });
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

    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
      },
    });

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const maxSale = Math.max(...sales.map((sale) => sale.total));
    const minSale = Math.min(...sales.map((sale) => sale.total));
    const avgSale = totalSales > 0 ? totalRevenue / totalSales : 0;

    return NextResponse.json(
      {
        total_sales: totalSales,
        total_revenue: totalRevenue,
        max_sale: maxSale,
        min_sale: minSale,
        avg_sale: avgSale,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Error obteniendo reporte" },
      { status: 500 }
    );
  }
}
