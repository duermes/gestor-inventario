import { UsersTable } from "@/app/components/dashboard/admin/usersTable";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Usario
        </Button>
      </div>
      <UsersTable />
    </div>
  );
}
