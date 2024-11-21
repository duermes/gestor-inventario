"use client";

import { ProductData } from "@/app/lib/auth/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import { ProductCategory } from "@prisma/client";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Edit, Trash } from "lucide-react";
import React, { useState } from "react";

export function ActionButtons({
  product,
  onProductUpdate,
}: {
  product: ProductData;
  onProductUpdate: () => void;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProduct),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      }
      setIsEditOpen(false);
      if (onProductUpdate) {
        onProductUpdate();
      }
    } catch (error) {
      setError("Ha ocurrido un error actualizando el usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch(`/api/products/${product.id}?delete=true`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      setIsDeleteOpen(false);
      if (onProductUpdate) {
        onProductUpdate();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <TableCell>
        <Button variant="ghost" size="icon" onClick={() => setIsEditOpen(true)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </TableCell>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={editedProduct.name}
                onChange={(e) =>
                  setEditedProduct({ ...editedProduct, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={editedProduct.description || ""}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={editedProduct.category}
                onValueChange={(value: ProductCategory) =>
                  setEditedProduct({ ...editedProduct, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BODY">Body</SelectItem>
                  <SelectItem value="BLUSA">Blusa</SelectItem>
                  <SelectItem value="POLO">Polo</SelectItem>
                  <SelectItem value="TOP">Top</SelectItem>
                  <SelectItem value="VESTIDO">Vestido</SelectItem>
                  <SelectItem value="ENTERIZO">Enterizo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Select
                value={editedProduct.material}
                onValueChange={(value: MaterialType) =>
                  setEditedProduct({ ...editedProduct, material: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OTROS">Otros</SelectItem>
                  <SelectItem value="SUPLEX">Suplex</SelectItem>
                  <SelectItem value="VIENA">Viena</SelectItem>
                  <SelectItem value="HILO">Hilo</SelectItem>
                  <SelectItem value="SCUBA">Scuba</SelectItem>
                  <SelectItem value="CUERINA">Cuerina</SelectItem>
                  <SelectItem value="RIP_GRUESO">Rip Grueso</SelectItem>
                  <SelectItem value="BABY_RIP">Baby Rip</SelectItem>
                  <SelectItem value="ALGODON_JERSEY">Algodón Jersey</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                type="number"
                value={editedProduct.price}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    price: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={editedProduct.stock}
                onChange={(e) =>
                  setEditedProduct({
                    ...editedProduct,
                    stock: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isActive">Estado</Label>
              <Select
                value={editedProduct.isActive ? "true" : "false"}
                onValueChange={(value) =>
                  setEditedProduct({
                    ...editedProduct,
                    isActive: value === "true",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Producto</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>¿Estás seguro de que quieres eliminar este producto?</p>
            <p className="text-sm text-muted-foreground mt-2">
              Esta acción es permanente y no se puede deshacer.
            </p>
          </div>
          {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
