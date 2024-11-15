"use client";

import { useState } from "react";
import { LoginCredentials, ValidationErrors } from "@/app/lib/auth/types";
import { useAuth } from "../authProvider";

export const LoginForm = () => {
  const { login, loading } = useAuth();

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    try {
      await login(credentials.email, credentials.password);
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general: "Credenciales inválidas. Por favor, intenta de nuevo.",
      });
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
            errors.email ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500`}
          required
          disabled={loading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
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
            errors.password ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500`}
          required
          disabled={loading}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>
      {errors.general && (
        <div className="text-sm text-red-500 text-center">{errors.general}</div>
      )}
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
