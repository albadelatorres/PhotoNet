"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hashtag, setHashtag] = useState(""); // Estado para el filtro
  const BACKEND_BASE_API = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    // Obtener todas las imágenes al cargar la página
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

  const handleFilter = async () => {
    if (!hashtag.trim()) {
      alert("Por favor, escribe un hashtag para filtrar.");
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_BASE_API}/imagenes/filter/${hashtag}`);
      setImagenes(response.data); // Actualizar las imágenes con el filtro aplicado
    } catch (err) {
      console.error("Error al filtrar imágenes:", err.message);
      setError(err.message);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Galería de Imágenes</h1>

      {/* Barra de texto para filtrar */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Filtrar por hashtag"
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleFilter}
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Filtrar
        </button>
      </div>

      {/* Galería de imágenes */}
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
