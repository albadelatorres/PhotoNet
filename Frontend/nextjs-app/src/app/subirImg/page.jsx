"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UploadImagePage() {
    const [file, setFile] = useState(null);
    const [descripcion, setDescripcion] = useState('');
    const [message, setMessage] = useState('');
    const [usuario, setUsuario] = useState('');

    // Función para obtener el valor de una cookie por su nombre
    const getCookie = (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };

    // Obtener el usuario de las cookies cuando el componente se monta
    useEffect(() => {
        const username = getCookie('username');
        if (username) {
            setUsuario(username);
        } else {
            setMessage('No se encontró el usuario en las cookies.');
        }
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file || !descripcion || !usuario) {
            setMessage('Por favor, completa todos los campos requeridos.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('descripcion', descripcion);
        formData.append('usuario', usuario);

        try {
            // Paso 1: Subir imagen a Cloudinary
            const uploadResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/imagenes/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            const imageUrl = uploadResponse.data.url; // Suponiendo que Cloudinary retorna `url`
            console.log('Imagen subida exitosamente:', imageUrl);

            // Paso 2: Guardar datos en la base de datos
            const saveResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/imagenes/new`,
                { usuario, descripcion, url: imageUrl },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            setMessage('Datos guardados exitosamente.');
            console.log('Respuesta del servidor:', saveResponse.data);
        } catch (error) {
            setMessage('Error al subir la imagen: ' + error.response?.data?.message || error.message);
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Subir Imagen</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="image">Seleccionar Imagen:</label>
                    <input type="file" id="image" onChange={handleFileChange} accept="image/*" />
                </div>
                <div>
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    ></textarea>
                </div>
                <button type="submit">Subir</button>
            </form>
        </div>
    );
}

