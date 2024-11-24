"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { ProductData } from "@/app/lib/auth/types";

interface SalesPageProps {
  onAddToCart: (product: Product, quantity: number) => void;
  onCompleteSale: () => void;
}

export function ProductSearch({ onAddToCart, onCompleteSale }: SalesPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState<ProductData[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getInventory = useCallback(async () => {
    setLoading(false);
    try {
      const response = await fetch("/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      if (!response.ok) {
        setError(data.error);
        return;
      }

      const availableProducts = data.filter(
        (item: ProductData) => item.isActive
      );
      setInventory(availableProducts);
    } catch (error) {
      setError("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getInventory();
  }, [onCompleteSale]);

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(3, value),
    }));
  };

  const handleAddToCart = (product: ProductData) => {
    const quantity = quantities[product.id] || 3;
    onAddToCart(product, quantity);
    setQuantities((prev) => ({
      ...prev,
      [product.id]: 3,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buscar Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-6">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar producto"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-muted-foreground">Cargando productos...</p>
        ) : (
          <div className="space-y-2">
            {filteredInventory.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Stock disponible: {product.stock}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={3}
                    max={product.stock}
                    value={quantities[product.id] || 3}
                    onChange={(e) =>
                      handleQuantityChange(product.id, parseInt(e.target.value))
                    }
                    className="w-20"
                  />
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock < (quantities[product.id] || 3)}
                  >
                    Agregar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
