"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Page() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual password reset logic
    setIsSubmitted(true);
  };

  return (
    <div className="">
      <div className="text-center mb-8">
        <Image
          src="/logo.svg"
          alt="Top Modas Logo"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-pink-900">
          Recuperar Contraseña
        </h1>
      </div>

      {!isSubmitted ? (
        <>
          <p className="text-gray-600 text-center mb-6">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para
            restablecer tu contraseña.
          </p>
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
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-400 to-pink-600 text-white py-2 rounded-md hover:from-pink-500 hover:to-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              Enviar Instrucciones
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <p className="text-green-600 mb-4">
            ¡Las instrucciones han sido enviadas a tu correo electrónico!
          </p>
          <p className="text-gray-600 mb-6">
            Por favor, revisa tu bandeja de entrada y sigue las instrucciones
            para restablecer tu contraseña.
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/")}
          className="text-pink-600 hover:underline text-sm"
        >
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
}
