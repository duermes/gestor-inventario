"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Edit, Trash } from "lucide-react";
import { useAuth } from "@/app/components/authProvider";
import { ProductsTable } from "@/app/components/dashboard/inventory/productsTable";

// Aqui se deberia de cargar los datos del inventario
const inventoryData = [
  { id: 1, name: "Camiseta", category: "Ropa", price: 19.99, stock: 100 },
  { id: 2, name: "Pantalón", category: "Ropa", price: 39.99, stock: 50 },
  { id: 3, name: "Zapatos", category: "Calzado", price: 59.99, stock: 30 },
];

export default function InventoryPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState(inventoryData);
  const [loading, setLoading] = useState(false);

  // const filteredInventory = inventory.filter((item) =>
  //   item.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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
      {/* <ProductsTable
        inventory={inventory}
        user={user}
        loading={loading}
        searchTerm={searchTerm}
      /> */}
      {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            {user.role == "ADMIN" && <TableHead>Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell>{item.stock}</TableCell>
              {user.role == "ADMIN" && (
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table> */}
    </div>
  );
}
