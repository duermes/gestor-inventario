"use client";

import { useState } from "react";
import { LoginCredentials } from "@/app/lib/auth/types";
import { useAuth } from "../authProvider";

export const LoginForm = () => {
  const { login, loading } = useAuth();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors("");
    try {
      const res = await login(credentials.email, credentials.password);
      if (res) {
        setErrors(res);
      }
    } catch (error) {
      setErrors(
        error instanceof Error ? error.message : "Error al iniciar sesión"
      );
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
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
          name="email"
          value={credentials.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500`}
          required
          disabled={loading}
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
          name="password"
          value={credentials.password}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            errors ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500`}
          required
          disabled={loading}
        />
      </div>
      <div className="text-sm text-red-500">{errors}</div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-pink-400 to-pink-600 text-white py-2 rounded-md hover:from-pink-500 hover:to-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        disabled={loading}
      >
        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>
    </form>
  );
};
