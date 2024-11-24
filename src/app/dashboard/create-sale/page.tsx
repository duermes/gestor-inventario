"use client";
import { Product } from "@prisma/client";
import { ProductSearch } from "@/app/components/sales/product-search";
import { ShoppingCart } from "@/app/components/sales/shopping-cart";
import { CartItem } from "@/app/lib/auth/types";
import { useAuth } from "@/app/components/authProvider";
import { useCallback, useState } from "react";

export default function SalesPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      const totalRequestedQuantity = currentQuantityInCart + quantity;

      if (totalRequestedQuantity > product.stock) {
        setMessage("No hay suficiente stock");
        setTimeout(() => {
          setMessage("");
        }, 2000);
        return prevCart;
      }

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: totalRequestedQuantity }
            : item
        );
      }

      return [...prevCart, { ...product, quantity }];
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

      const response = await fetch(`/api/sales/${user.id}`, {
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
      const res = await response.json();

      if (!response.ok) {
        setMessage(res.error);

        return;
      }

      if (res.error) {
        setMessage(res.error);

        return;
      }

      setMessage("La venta se ha registrado exitosamente");

      setCart([]);
    } catch (error) {
      console.log(error);
      setMessage("Ha ocurrido un error desconocido");
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setMessage("");
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Generar Venta</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <ProductSearch
          onAddToCart={handleAddToCart}
          onCompleteSale={handleCompleteSale}
        />
        <ShoppingCart
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCompleteSale={handleCompleteSale}
          isProcessing={isProcessing}
          message={message}
        />
      </div>
    </div>
  );
}
