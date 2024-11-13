"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "../../ui/dataTable";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

const columns = [
  {
    accessorKey: "name" as keyof User,
    header: "Nombre",
  },

  {
    accessorKey: "email" as keyof User,
    header: "Email",
  },

  {
    accessorKey: "role" as keyof User,
    header: "Rol",
  },

  {
    accessorKey: "isActive" as keyof User,
    header: "Activo",
    cell: (item: User) => (
      <span className={item.isActive ? "text-green-600" : "text-red-600"}>
        {item.isActive ? "Activo" : "Inactivo"}
      </span>
    ),
  },
  {
    accessorKey: "id" as keyof User,
    header: "Id",
  },
  {
    accessorKey: "createdAt" as keyof User,
    header: "Creado",
  },
  {
    accessorKey: "updatedAt" as keyof User,
    header: "Actualizado",
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    cell: (item: User) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Hubo un error al cargar los usuarios");
        }
      } catch (error) {
        console.error("Hubo un error al cargar los usuarios", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  return <DataTable columns={columns} data={users} />;
}
