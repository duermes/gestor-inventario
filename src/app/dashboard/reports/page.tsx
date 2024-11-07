import { ReportsTable } from "@/app/components/dashboard/admin/reportsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reportes</h1>
      <Tabs defaultValue="movements">
        <TabsList>
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
        </TabsList>
        <TabsContent value="movements">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <ReportsTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Ventas</CardTitle>
            </CardHeader>
            <CardContent>{/* Add sales report content */}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Reporte de Inventario</CardTitle>
            </CardHeader>
            <CardContent>{/* Add inventory report content */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
