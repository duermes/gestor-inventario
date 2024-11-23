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
import { useAuth } from "../authProvider";

const adminNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Inventario", href: "/dashboard/inventory", icon: Package },
  { name: "Reportes", href: "/dashboard/reports", icon: BarChart2 },
  { name: "Añadir Producto", href: "/dashboard/add-product", icon: PlusCircle },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
  { name: "Usuarios", href: "/dashboard/users", icon: Users },
  { name: "Generar Venta", href: "/dashboard/create-sale", icon: ShoppingCart },
];

const userNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Inventario", href: "/dashboard/inventory", icon: Package },
  { name: "Generar Venta", href: "/dashboard/create-sale", icon: ShoppingCart },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (user?.role === "ADMIN") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [isAdmin]);

  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await logout();
  };

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
          href=""
          className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Cerrar sesión
        </Link>
      </div>
    </div>
  );
}
