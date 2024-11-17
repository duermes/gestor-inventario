import Settings from "@/app/components/dashboard/settings";

export default function Page() {
  return (
    <div className="container mx-auto">
      <div className="max-w-2xl-y-6 mx-auto space-y-6 ">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold mb-6">Configuración</h1>
          <p className="text-muted-foreground">
            Administra tu configuración y preferencias de cuenta
          </p>
        </div>
        <Settings />
      </div>
    </div>
  );
}
