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
import { ProductData } from "@/app/lib/auth/types";
import { useAuth } from "@/app/components/authProvider";

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<ProductData>({
    name: "",
    description: "",
    category: "",
    material: "",
    size: "estandar",
    color: "colores comerciales",
    price: "",
    stock: "",
  });
  const { user } = useAuth();

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      material: "",
      size: "estandar",
      color: "colores comerciales",
      price: "",
      stock: "",
    });
  };

  function resetMessages() {
    setTimeout(() => {
      setError("");
      setSuccess("");
    }, 1000);
  }

  const createProduct = async (productData: ProductData) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/products?userId=${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (res.status === 200) {
        resetForm();
        return data;
      } else {
        return { error: data.error };
      }
    } catch (error) {
      console.log(error);
      return { error: "Error al crear producto" };
    } finally {
      resetMessages();
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string, name: keyof ProductData) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const res = await createProduct(formData);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess("Producto creado exitosamente");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Añadir Producto</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información del Producto</CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del Producto</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ingrese el nombre del producto"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleSelectChange(value, "category")
                  }
                  required
                >
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
                <Select
                  value={formData.material}
                  onValueChange={(value) =>
                    handleSelectChange(value, "material")
                  }
                  required
                >
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
                    <SelectItem value="ALGODON_JERSEY">
                      Algodón Jersey
                    </SelectItem>
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
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock Inicial</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="size">Talla</Label>
                <Input
                  id="size"
                  name="size"
                  placeholder="Talla"
                  value={formData.size}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  placeholder="Color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descripción del producto"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
          {error && <div className="px-6 text-sm text-red-500">{error}</div>}
          {success && (
            <div className="px-6 text-sm text-green-700">{success}</div>
          )}

          <CardFooter className="flex justify-end gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Producto"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
