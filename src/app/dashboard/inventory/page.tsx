"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/app/components/authProvider";
import { ProductData } from "@/app/lib/auth/types";
import { ActionButtons } from "@/app/components/dashboard/inventory/actionButtons";

export default function InventoryPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getInventory = useCallback(async () => {
    setLoading(true);
    await fetch("/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const data = await res.json();
        const filteredData =
          user?.role === "ADMIN"
            ? data
            : data.filter((item: ProductData) => item.isActive);
        if (res.status === 200) {
          setInventory(filteredData);
        } else {
          setError(data.error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getInventory();
  }, [getInventory]);

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return <div>Debes de iniciar sesión para poder ver esta página.</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div className="text-center py-4">Cargando inventario...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Inventario</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar producto"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Material</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Talla</TableHead>
            <TableHead>Descripcion</TableHead>
            {user.role == "ADMIN" && <TableHead>Estado</TableHead>}

            {user.role == "ADMIN" && <TableHead>Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>S/ {item.price}</TableCell>
              <TableCell>{item.stock}</TableCell>
              <TableCell>{item.material}</TableCell>
              <TableCell>{item.color}</TableCell>
              <TableCell>{item.size}</TableCell>
              <TableCell>{item.description}</TableCell>
              {user.role == "ADMIN" && (
                <TableCell
                  className={item.isActive ? "text-green-600" : "text-red-600"}
                >
                  {item.isActive ? "Activo" : "Inactivo"}
                </TableCell>
              )}

              {user.role == "ADMIN" && (
                <ActionButtons product={item} onProductUpdate={getInventory} />
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
