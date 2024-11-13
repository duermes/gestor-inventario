"use client";

import { UserForm } from "@/app/components/dashboard/admin/users/userForm";
import { UsersTable } from "@/app/components/dashboard/admin/users/usersTable";

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <UserForm />
      </div>
      <UsersTable />
    </div>
  );
}
