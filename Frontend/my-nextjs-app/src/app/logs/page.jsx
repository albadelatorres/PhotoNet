"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_BASE_API = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${BACKEND_BASE_API}/logs`);
      if (response.status === 200) {
        setLogs(response.data);
      } else {
        setError("Error al cargar los logs.");
      }
    } catch (err) {
      setError("No se pudo conectar con la API.");
      console.error("Error al obtener los logs:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (isLoading) {
    return <p className="text-center">Cargando logs...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Logs</h1>
      {logs.length === 0 ? (
        <p className="text-center">No hay logs disponibles.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Timestamp</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Token Expiry</th>
              <th className="py-2 px-4 border-b">Token</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="text-center">
                <td className="py-2 px-4 border-b">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{log.email}</td>
                <td className="py-2 px-4 border-b">{new Date(log.tokenExpiry).toLocaleString()}</td>
                <td className="py-2 px-4 border-b truncate">{log.token}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
