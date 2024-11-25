"use client";

import { useState, useEffect } from "react";
import {
  BarChart2,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Download,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { json2csv } from "json-2-csv";

type StatData = {
  max: number;
  min: number;
  average: number;
  total: number;
  count: number;
};

type LogData = {
  id: string;
  action: string;
  productId: string;
  productName: string;
  quantity: number;
  user: {
    name: string;
    lastName: string;
  };
  createdAt: string;
};

export function StatsReport() {
  const [reportType, setReportType] = useState("ventas");
  const [period, setPeriod] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, StatData>>({
    ventas: {
      max: 0,
      min: 0,
      average: 0,
      total: 0,
      count: 0,
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/sales/stats?period=${period}`);
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const result = await response.json();
      setStats({
        ventas: {
          max: result.max_sale,
          min: result.min_sale,
          average: result.avg_sale,
          total: result.total_revenue,
          count: result.total_sales,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const prepareDataForCSV = (stats: Record<string, StatData>) => {
    return [
      {
        "Tipo de Reporte": reportType,
        Período: period,
        "Valor Máximo": formatCurrency(stats[reportType].max),
        "Valor Mínimo": formatCurrency(stats[reportType].min),
        Promedio: formatCurrency(stats[reportType].average),
        Total: formatCurrency(stats[reportType].total),
        "Cantidad de Registros": stats[reportType].count,
        "Fecha de Generación": new Date().toLocaleString(),
      },
    ];
  };

  const downloadReport = async () => {
    if (!stats[reportType]) return;

    setDownloading(true);
    try {
      const preparedData = prepareDataForCSV(stats);
      const options = {
        delimiter: {
          field: ",",
          wrap: '"',
        },
        excelBOM: true,
      };

      const csv = json2csv(preparedData, options);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `reporte_estadistico_${reportType}_${period}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error al generar CSV:", error);
      setError("Error al generar el archivo CSV");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, period]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Reportes Estadísticos
          </h2>
          <p className="text-muted-foreground">
            Análisis de máximos, mínimos y promedios
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de reporte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ventas">Ventas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diario</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={fetchReport} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {loading ? "Cargando..." : "Actualizar"}
        </Button>
        <Button
          variant="outline"
          onClick={downloadReport}
          disabled={downloading}
        >
          {downloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {downloading ? "Descargando..." : "Descargar"}
        </Button>
      </div>

      <Tabs defaultValue="estadisticas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>
        <TabsContent value="estadisticas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor Máximo
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats[reportType].max)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor más alto registrado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor Mínimo
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats[reportType].min)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor más bajo registrado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promedio</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats[reportType].average)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Promedio del período
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumen del Período</CardTitle>
              <CardDescription>
                Estadísticas para el período seleccionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total
                  </p>
                  <p className="text-xl font-bold">
                    {formatCurrency(stats[reportType].total)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Cantidad de Registros
                  </p>
                  <p className="text-xl font-bold">{stats[reportType].count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
