"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "../authProvider";

export default function Settings() {
  const { changePassword, loading } = useAuth();
  const [formData, setFormData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await changePassword(formData.password, formData.newPassword);
      setMessage(res);
    } catch (error) {
      console.log(error);
      setMessage("Error al crear usuario");
    }
  };

  return (
    <Tabs defaultValue="password" className="space-y-4">
      <TabsList>
        <TabsTrigger value="password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" /> Contraseña
        </TabsTrigger>
        {/* <TabsTrigger value="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Correo Electrónico
        </TabsTrigger> */}
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
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña Actual</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Contraseña"}
              </Button>
              {message && (
                <p className="text-sm text-muted-foreground">{message}</p>
              )}
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      {/* 
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
                <Input id="newEmail" name="newEmail" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailPassword">Confirmar Contraseña</Label>
                <Input
                  id="emailPassword"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar Correo"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent> */}
    </Tabs>
  );
}
