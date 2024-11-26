"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { json2csv } from "json-2-csv";

export function DeletedProductsReport() {
  const [period, setPeriod] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const fetchReport = useCallback(async () => {
    setError("");
    setData([]);
    setLoading(true);
    try {
      const response = await fetch(
        `/api/products/reports?period=${period}&action=ELIMINAR_PRODUCTO`
      );
      const result = await response.json();
      if (!response.ok) {
        return setError(result.error);
      }
      if (result.error) {
        return setError(error);
      }
      console.log(result);
      setData(result);
    } catch (error) {
      console.error("Error fetching report:", error);
      setError("Error obteniendo reporte");
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  useEffect(() => {
    fetchReport();
  }, []);

  const prepareDataForCSV = (data) => {
    return data.map((log) => ({
      "ID Accion": log.id,
      "ID Producto": log.productId || "N/A",
      "Nombre Producto": log.productName || "N/A",
      Usuario: `${log.user.name} ${log.user.lastName}`,
      Fecha: new Date(log.createdAt).toLocaleDateString(),
      Hora: new Date(log.createdAt).toLocaleTimeString(),
    }));
  };

  const downloadReport = async () => {
    if (data.length === 0) return;

    setDownloading(true);
    try {
      const preparedData = prepareDataForCSV(data);
      const options = {
        delimiter: {
          field: ",",
          wrap: '"',
        },
        excelBOM: true,
      };

      const csv = await json2csv(preparedData, options);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `reporte_logs_${period}_${new Date().toISOString().split("T")[0]}.csv`
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
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="space-y-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diario</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={fetchReport} disabled={loading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {loading ? "Cargando..." : "Actualizar"}
            </Button>
            <Button
              variant="outline"
              onClick={downloadReport}
              disabled={downloading || data.length === 0}
            >
              {downloading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {downloading ? "Descargando..." : "Descargar"}
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Accion</TableHead>
              <TableHead>ID Producto</TableHead>
              <TableHead>Nombre Producto</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  {error ||
                    (loading ? "Cargando..." : "No hay datos disponibles")}
                </TableCell>
              </TableRow>
            ) : (
              data.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.id}</TableCell>
                  <TableCell>{log.productId}</TableCell>
                  <TableCell>{log.productName}</TableCell>

                  <TableCell>{`${log.user.name} ${log.user.lastName}`}</TableCell>
                  <TableCell>
                    {new Date(log.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
