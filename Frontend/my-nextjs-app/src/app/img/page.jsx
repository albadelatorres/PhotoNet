"use client";

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Page() {
    const [imagenes, setImagenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Define la URL desde las variables de entorno
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/imagenes`);
                setImagenes(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Galería de Imágenes</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {imagenes.map((imagen) => (
                    <div key={imagen._id} style={{ border: '1px solid #ccc', padding: '10px', maxWidth: '200px' }}>
                        <img src={imagen.url} alt={imagen.descripcion} style={{ width: '100%' }} />
                        <p>{imagen.descripcion}</p>
                        <p>Likes: {imagen.likes}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
