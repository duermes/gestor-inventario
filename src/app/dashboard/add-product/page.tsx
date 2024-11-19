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
  const [error, setError] = useState("");

  const createProduct = async (productData) => {
    try {
      setLoading(true);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (res.status === 200) {
        return data;
      }
      return { error: data.error };
    } catch (error) {
      return { error: "Error al crear producto" };
    } finally {
      setLoading(false);
    }
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      material: formData.get("material") as string,
      size: formData.get("size") as string,
      color: formData.get("color") as "ADMIN" | "USER",
      price: formData.get("price") as number,
      stock: formData.get("stock") as number,
      imageUrl: formData.get("imageUrl") as string,
    };
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Añadir Producto</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
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
                  <SelectItem value="BODY">Body</SelectItem>
                  <SelectItem value="BLUSA">Blusa</SelectItem>
                  <SelectItem value="POLO">Polo</SelectItem>
                  <SelectItem value="TOP">Top</SelectItem>
                  <SelectItem value="VESTIDO">Vestido</SelectItem>
                  <SelectItem value="ENTERIZO">Enterizo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material">Material</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un material" />
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
                  <SelectItem value="SEDA">Seda</SelectItem>
                  <SelectItem value="SHANEL">Shanel</SelectItem>
                  <SelectItem value="WAFER">Wafer</SelectItem>
                  <SelectItem value="CHALIS">Chalis</SelectItem>
                  <SelectItem value="SLINKY">Slinky</SelectItem>
                  <SelectItem value="SEDA_FRANCESA">Seda Francesa</SelectItem>
                  <SelectItem value="LINO">Lino</SelectItem>
                  <SelectItem value="PRADA">Prada</SelectItem>
                  <SelectItem value="CATANIA">Catania</SelectItem>
                  <SelectItem value="ASTURIA">Asturia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Precio</Label>
              <Input id="price" type="number" placeholder="0.00" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock">Stock Inicial</Label>
              <Input
                id="stock"
                type="number"
                placeholder="0"
                required={false}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="size">Talla</Label>
              <Input
                id="stock"
                type="string"
                placeholder="0"
                value="estandar"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                type="string"
                placeholder="0"
                value="colores comerciales"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Descripción del producto"
                required={false}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button disabled={loading}>
            {loading ? "Guardando..." : "Guardar Producto"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
