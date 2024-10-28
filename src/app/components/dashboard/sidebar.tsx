"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Inventario", href: "/dashboard/inventory", icon: ShoppingBag },
  { name: "Reportes", href: "/dashboard/reports", icon: BarChart2 },
  { name: "Configuración", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } ${
          isMobile ? "w-64" : "w-64 translate-x-0"
        } transition duration-200 ease-in-out bg-white shadow-lg z-30`}
      >
        <div className="flex items-center justify-center h-16 border-b">
          <span className="text-2xl font-semibold text-purple-800">
            Top Modas
          </span>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800 ${
                isActive(item.href) ? "bg-purple-100 text-purple-800" : ""
              }`}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4">
          <Link
            href="/logout"
            className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            onClick={isMobile ? toggleSidebar : undefined}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar sesión
          </Link>
        </div>
      </div>
    </>
  );
}
