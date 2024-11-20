import { Button } from "@/components/ui/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Table, Trash } from "lucide-react";

export function ProductsTable({ inventory, user, loading, searchTerm }) {
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-4">Cargando inventario...</div>;
  }

  if (filteredInventory.length === 0) {
    return <div className="text-center py-4">No se encontraron productos</div>;
  }
  if (user.role !== "ADMIN") {
    return <div>No tienes permisos para ver esta página</div>;
  }

  return (
    <Table>
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
    </Table>
  );
}
