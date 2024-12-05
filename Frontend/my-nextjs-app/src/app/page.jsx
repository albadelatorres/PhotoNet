"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState(null);
  console.log("BACKEND_BASE_API:", process.env.NEXT_PUBLIC_MONGO_DB_URI);

  useEffect(() => {
    // Fetch user data from the server (usaremos un endpoint en `/api/auth/me`)
    const fetchUser = async () => {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = () => {
    // Redirige al endpoint de inicio de sesión
    window.location.href = "/api/auth/github";
  };

  const handleLogout = async () => {
    // Cierra la sesión llamando al endpoint correspondiente
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <div className="bg-white p-8 rounded shadow-md max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4">Bienvenido a EMTInfo</h1>
        {user ? (
          <div>
            <p className="mb-4">Hola, <strong>{user.email}</strong>. Estás autenticado.</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-4">Inicia sesión para acceder a tu cuenta.</p>
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Iniciar Sesión con GitHub
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
