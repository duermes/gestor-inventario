"use client";

import React from "react";
import { DataTable } from "../../../ui/dataTable";
import { ActionButtons } from "./actionButtons";
import { User } from "@/app/lib/auth/types";
import { useAuth } from "@/app/components/authProvider";

export function UsersTable({
  users,
  loading,
  onUserUpdated,
}: {
  users: User[];
  loading: boolean;
  onUserUpdated: () => Promise<void>;
}) {
  const { user } = useAuth();

  const columns = [
    {
      accessorKey: "name" as keyof User,
      header: "Nombre",
    },
    {
      accessorKey: "lastName" as keyof User,
      header: "Apellido",
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
        <ActionButtons user={item} onUserUpdated={onUserUpdated} />
      ),
    },
  ];

  if (!user) {
    return <div>Debes de iniciar sesion para ver esta pagina</div>;
  }
  if (user.role !== "ADMIN") {
    return <div>No tienes permisos para ver esta página</div>;
  }

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  if (!users) {
    return <div>Error al cargar los usuarios</div>;
  }

  return <DataTable columns={columns} data={users} />;
}
