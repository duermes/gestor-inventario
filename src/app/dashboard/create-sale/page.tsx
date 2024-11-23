"use client";

import { useState } from "react";
import { Product } from "@prisma/client";
import { ProductSearch } from "@/app/components/sales/product-search";
import { ShoppingCart } from "@/app/components/sales/shopping-cart";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/app/lib/auth/types";

export default function SalesPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevCart, { ...product, quantity }];
    });

    toast({
      title: "Producto agregado",
      description: `Se agregó ${quantity} unidades de ${product.name} al carrito`,
    });
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 3) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleCompleteSale = async () => {
    try {
      setIsProcessing(true);

      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al procesar la venta");
      }

      toast({
        title: "Venta completada",
        description: "La venta se ha registrado exitosamente",
      });

      setCart([]);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error desconocido",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Generar Venta</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <ProductSearch onAddToCart={handleAddToCart} />
        <ShoppingCart
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCompleteSale={handleCompleteSale}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
}
