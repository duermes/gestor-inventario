import { DatesReport } from "@/app/components/dashboard/reports/datesReport";
import { DeletedProductsReport } from "@/app/components/dashboard/reports/deletedProductsReport";
import { ProfitReport } from "@/app/components/dashboard/reports/profitReport";
import { SalesReport } from "@/app/components/dashboard/reports/salesReport";
import { StatsReport } from "@/app/components/dashboard/reports/statsReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reportes</h1>
      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="stats">Estadística</TabsTrigger>
          <TabsTrigger value="deleted">Eliminados</TabsTrigger>
          <TabsTrigger value="profit">Ingresos/Utilidad</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesReport />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardContent>
              <StatsReport />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deleted">
          <Card>
            <CardHeader>
              <CardTitle>Productos Eliminados</CardTitle>
            </CardHeader>
            <CardContent>
              <DeletedProductsReport />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Ingresos y Utilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfitReport />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
