"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Luego editarlo, porque antes de mandarlo al dashboard tengo que verificar las credenciales
    router.push("/dashboard");
    console.log("Login attempted with:", email, password);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-200 to-pink-400">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/logo.svg"
            alt="Top Modas Logo"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-pink-900">Top Modas</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo electrónico:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-pink-600 text-white py-2 rounded-md hover:from-pink-500 hover:to-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            Iniciar Sesión
          </button>
        </form>
        <div className="mt-6 text-center text-sm space-y-2">
          <p className="text-gray-600">¿Necesitas ayuda?</p>
          <a href="#" className="text-pink-600 hover:underline block">
            ¿Olvidaste tu contraseña?
          </a>
          <a href="#" className="text-pink-600 hover:underline block">
            Contactar al Administrador
          </a>
        </div>
      </div>
      <footer className="absolute bottom-4 text-center w-full text-white text-sm">
        © 2024 Top Modas. Todos los derechos reservados.
      </footer>
    </div>
  );
}
