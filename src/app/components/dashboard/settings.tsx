"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Mail, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  return (
    <Tabs defaultValue="password" className="space-y-4">
      <TabsList>
        <TabsTrigger value="password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" /> Contraseña
        </TabsTrigger>
        <TabsTrigger value="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Correo Electrónico
        </TabsTrigger>
      </TabsList>

      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Cambiar Contraseña</CardTitle>
            <CardDescription>
              Actualiza tu contraseña para mantener tu cuenta segura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  //   value={passwordData.currentPassword}
                  //   onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  //   value={passwordData.newPassword}
                  //   onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirmar Nueva Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  //   value={passwordData.confirmPassword}
                  //   onChange={handlePasswordChange}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Contraseña"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Cambiar Correo Electrónico</CardTitle>
            <CardDescription>
              Actualiza tu dirección de correo electrónico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newEmail">Nuevo Correo Electrónico</Label>
                <Input
                  id="newEmail"
                  name="newEmail"
                  type="email"
                  //   value={emailData.newEmail}
                  //   onChange={handleEmailChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailPassword">Confirmar Contraseña</Label>
                <Input
                  id="emailPassword"
                  name="password"
                  type="password"
                  //   value={emailData.password}
                  //   onChange={handleEmailChange}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Correo"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
