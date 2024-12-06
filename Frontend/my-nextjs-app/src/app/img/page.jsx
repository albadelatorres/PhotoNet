"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_BASE_API = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    // Obtener las imágenes del backend
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${BACKEND_BASE_API}/imagenes`);
        setImagenes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleLike = async (idImagen) => {
    try {
      const response = await axios.post(`${BACKEND_BASE_API}/imagenes/${idImagen}/like`);
      if (response.status === 200) {
        // Actualizar los likes en el estado local
        setImagenes((prev) =>
          prev.map((img) =>
            img._id === idImagen ? { ...img, likes: img.likes + 1 } : img
          )
        );
      }
    } catch (err) {
      console.error("Error al dar like:", err.message);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Galería de Imágenes</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {imagenes.map((imagen) => (
          <div
            key={imagen._id}
            style={{ border: "1px solid #ccc", padding: "10px", maxWidth: "200px" }}
          >
            <img
              src={imagen.url}
              alt={imagen.descripcion}
              style={{ width: "100%" }}
            />
            <p>{imagen.descripcion}</p>
            <p>Likes: {imagen.likes}</p>
            <button
              onClick={() => handleLike(imagen._id)}
              style={{
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Dar Like
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

