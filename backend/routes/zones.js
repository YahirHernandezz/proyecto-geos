//backend/routes/zones.js
const express = require('express');
const router = express.Router();
const Zone = require('../models/Zone');
const authenticateToken = require('../middleware/auth');

// Obtener todas las zonas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const zones = await Zone.find();
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crear una zona
router.post('/', authenticateToken, async (req, res) => {
  const { name, description, coordinates } = req.body;

  const zone = new Zone({
    name,
    description,
    coordinates
  });

  try {
    const newZone = await zone.save();
    res.status(201).json(newZone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar zona
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, coordinates } = req.body;
    const zone = await Zone.findById(req.params.id);
    
    if (!zone) {
      return res.status(404).json({ message: 'Zona no encontrada' });
    }

    zone.name = name;
    zone.description = description;
    zone.coordinates = coordinates;

    const updatedZone = await zone.save();
    res.json(updatedZone);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Borrar zona
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);
    
    if (!zone) {
      return res.status(404).json({ message: 'Zona no encontrada' });
    }

    await zone.deleteOne();
    res.json({ message: 'Zona eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;