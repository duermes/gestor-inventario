"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  Users,
  BarChart2,
  Settings,
  ShoppingCart,
  PlusCircle,
  LogOut,
} from "lucide-react";

const adminNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Inventario", href: "/dashboard/inventory", icon: Package },
  { name: "Clientes", href: "/dashboard/customers", icon: Users },
  { name: "Reportes", href: "/dashboard/reports", icon: BarChart2 },
  { name: "Añadir Producto", href: "/dashboard/add-product", icon: PlusCircle },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
  { name: "Usuarios", href: "/dashboard/users", icon: Users },
];

const userNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Inventario", href: "/dashboard/inventory", icon: Package },
  { name: "Generar Venta", href: "/dashboard/create-sale", icon: ShoppingCart },
];

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Aquí se debe de verificar si es ADMIN o USUARIO
    setIsAdmin(true); // Ejemplo, forzado admin
  }, []);

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl font-bold text-purple-800">Top Modas</h1>
      </div>
      <nav className="flex-grow">
        <ul className="py-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800 ${
                  pathname === item.href ? "bg-purple-100 text-purple-800" : ""
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4">
        <Link
          href="/logout"
          className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar sesión
        </Link>
      </div>
    </div>
  );
}
