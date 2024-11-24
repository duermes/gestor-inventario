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
import { Download, Key, Loader2, RefreshCw } from "lucide-react";
import { json2csv } from "json-2-csv";

export function SalesReport() {
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
      const response = await fetch(`/api/sales?period=${period}`);
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
      setError("Error fetching report");
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
    return data.flatMap((sale) =>
      sale.items.map((item) => ({
        "No. Venta": sale.id.slice(-6),
        Producto: item.product.name,
        Cantidad: item.quantity,
        "Precio Unitario": `$${item.price.toFixed(2)}`,
        Subtotal: `$${item.subtotal.toFixed(2)}`,
        "Total Venta": `$${sale.total.toFixed(2)}`,
        Fecha: new Date(sale.createdAt).toLocaleDateString(),
        Vendedor: `${sale.user.name} ${sale.user.lastName}`,
      }))
    );
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
        `reporte_ventas_${period}_${new Date().toISOString().split("T")[0]}.csv`
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
              <TableHead>No. Venta</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Precio Unitario</TableHead>
              <TableHead>Subtotal</TableHead>
              <TableHead>Total Venta</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Vendedor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  {error} {loading && "Cargando..."}
                </TableCell>
              </TableRow>
            ) : (
              data.map((sale) => (
                <>
                  {sale.items.map((item, index) => (
                    <TableRow
                      key={`${sale.id}-${item.id}`}
                      className={
                        index === 0 ? "border-t-2 border-t-primary/20" : ""
                      }
                    >
                      {index === 0 ? (
                        <>
                          <TableCell
                            rowSpan={sale.items.length}
                            className="align-middle"
                          >
                            {sale.id.slice(-6)}
                          </TableCell>
                        </>
                      ) : null}
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>${item.subtotal}</TableCell>
                      {index === 0 ? (
                        <>
                          <TableCell
                            rowSpan={sale.items.length}
                            className="align-middle"
                          >
                            ${sale.total}
                          </TableCell>
                          <TableCell
                            rowSpan={sale.items.length}
                            className="align-middle"
                          >
                            {new Date(sale.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell
                            rowSpan={sale.items.length}
                            className="align-middle"
                          >
                            {`${sale.user.name} ${sale.user.lastName}`}
                          </TableCell>
                        </>
                      ) : null}
                    </TableRow>
                  ))}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
