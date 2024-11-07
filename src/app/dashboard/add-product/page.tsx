"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Añadir Producto</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input id="name" placeholder="Ingrese el nombre del producto" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ropa">Ropa</SelectItem>
                  <SelectItem value="calzado">Calzado</SelectItem>
                  <SelectItem value="accesorios">Accesorios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Precio</Label>
              <Input id="price" type="number" placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock Inicial</Label>
              <Input id="stock" type="number" placeholder="0" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Descripción del producto"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="outline">Cancelar</Button>
          <Button disabled={loading}>
            {loading ? "Guardando..." : "Guardar Producto"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
