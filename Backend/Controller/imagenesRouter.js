const express = require('express');
const router = express.Router();
const Imagenes = require('../Model/imagenes');

// Crear una nueva imagen
router.post('/', async (req, res) => {
    try {
        const { usuario, url, descripcion } = req.body;

        // Extraer hashtags de la descripción
        const hashtags = descripcion.match(/#[a-zA-Z0-9_]+/g) || [];

        const nuevaImagen = new Imagenes({ usuario, url, descripcion, hashtags });
        await nuevaImagen.save();
        res.status(201).json(nuevaImagen);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Leer todas las imágenes
router.get('/', async (req, res) => {
    try {
        const imagenes = await Imagenes.find().sort({ likes: -1 }); // Ordenadas por likes
        res.status(200).json(imagenes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Leer una imagen por ID
router.get('/:id', async (req, res) => {
    try {
        const imagen = await Imagenes.findById(req.params.id);
        if (!imagen) return res.status(404).json({ error: 'Imagen no encontrada' });
        res.status(200).json(imagen);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar descripción de una imagen
router.put('/:id', async (req, res) => {
    try {
        const { descripcion } = req.body;

        // Extraer nuevos hashtags
        const hashtags = descripcion.match(/#[a-zA-Z0-9_]+/g) || [];

        const imagenActualizada = await Imagenes.findByIdAndUpdate(
            req.params.id,
            { descripcion, hashtags },
            { new: true }
        );
        if (!imagenActualizada) return res.status(404).json({ error: 'Imagen no encontrada' });
        res.status(200).json(imagenActualizada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar una imagen
router.delete('/:id', async (req, res) => {
    try {
        const imagenEliminada = await Imagenes.findByIdAndDelete(req.params.id);
        if (!imagenEliminada) return res.status(404).json({ error: 'Imagen no encontrada' });
        res.status(200).json({ message: 'Imagen eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dar like a una imagen
router.post('/:id/like', async (req, res) => {
    try {
        const imagen = await Imagenes.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } },
            { new: true }
        );
        if (!imagen) return res.status(404).json({ error: 'Imagen no encontrada' });
        res.status(200).json(imagen);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
