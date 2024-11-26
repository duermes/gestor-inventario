"use client";

import { UserForm } from "@/app/components/dashboard/admin/users/userForm";
import { UsersTable } from "@/app/components/dashboard/admin/users/usersTable";
import { RegisterInput } from "@/app/lib/auth/types";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async () => {
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
        return data;
      } else {
        console.error("Error al cargar los usuarios");
      }
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const createUser = async (userData: RegisterInput) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          lastName: userData.lastName,
          role: userData.role,
        }),
      });

      const data = await response.json();
      if (response.status == 201) {
        setLoading(true);
        await getUsers();
        setLoading(false);
        return data;
      } else {
        return { error: data.error };
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      return { error: "Error al crear el usuario" };
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <UserForm onUserCreated={createUser} loading={loading} />
      </div>
      <UsersTable users={users} loading={loading} onUserUpdated={getUsers} />
    </div>
  );
}
