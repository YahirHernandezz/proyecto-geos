const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const authenticateToken = require('../middleware/auth');

// Obtener todos los recursos
router.get('/', authenticateToken, async (req, res) => {
    try {
        const resources = await Resource.find().populate('placeId', 'name');
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener un recurso específico
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id).populate('placeId', 'name');
        if (!resource) {
            return res.status(404).json({ message: 'Recurso no encontrado' });
        }
        res.json(resource);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Crear un nuevo recurso
router.post('/', authenticateToken, async (req, res) => {
    const { resourceType, quantity, latitude, longitude, status, placeId, criticalLevel, notes } = req.body;

    try {
        const newResource = new Resource({
            resourceType,
            quantity,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            status: status || 'Disponible',
            placeId,
            criticalLevel: criticalLevel || 10,
            notes,
            lastUpdated: Date.now()
        });

        const savedResource = await newResource.save();
        res.status(201).json(savedResource);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Actualizar un recurso
router.put('/:id', authenticateToken, async (req, res) => {
    const { resourceType, quantity, latitude, longitude, status, placeId, criticalLevel, notes } = req.body;

    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Recurso no encontrado' });
        }

        resource.resourceType = resourceType;
        resource.quantity = quantity;
        resource.location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        };
        resource.status = status;
        resource.placeId = placeId;
        resource.criticalLevel = criticalLevel;
        resource.notes = notes;
        resource.lastUpdated = Date.now();

        const updatedResource = await resource.save();
        res.json(updatedResource);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar un recurso
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Recurso no encontrado' });
        }

        await resource.deleteOne();
        res.json({ message: 'Recurso eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener recursos críticos (por debajo del nivel crítico)
router.get('/status/critical', authenticateToken, async (req, res) => {
    try {
        const criticalResources = await Resource.find({
            $expr: { $lte: ['$quantity', '$criticalLevel'] }
        }).populate('placeId', 'name');
        res.json(criticalResources);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
