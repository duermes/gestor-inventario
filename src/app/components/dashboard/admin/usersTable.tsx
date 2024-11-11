"use client";

import React from "react";
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
    accessorKey: "id" as keyof User,
    header: "Id",
  },
  {
    accessorKey: "email" as keyof User,
    header: "Email",
  },
  {
    accessorKey: "name" as keyof User,
    header: "Nombre",
  },
  {
    accessorKey: "role" as keyof User,
    header: "Rol",
  },
  {
    accessorKey: "isActive" as keyof User,
    header: "Activo",
    cell: (item: User) => (
      <span
        className={item.isActive === "Si" ? "text-green-600" : "text-red-600"}
      >
        {item.isActive}
      </span>
    ),
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
    accessorKey: "id" as keyof User,
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

const data: User[] = [
  {
    id: "1",
    email: "lorena@lorena.com",
    name: "Juan Pérez",
    role: "Admin",
    isActive: "Si",
    createdAt: "2021-10-10",
    updatedAt: "2021-10-10",
  },
];

export function UsersTable() {
  return <DataTable columns={columns} data={data} />;
}
