const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
    const { name, description, latitude, longitude } = req.body;
    try {
        const place = new Place({
            name,
            description,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
        });
        const saved = await place.save();
        res.json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Endpoint para actualizar un lugar
router.put('/:id', authenticateToken, async (req, res) => {
    const { name, description, latitude, longitude } = req.body;
    try {
        const place = await Place.findByIdAndUpdate(
            req.params.id,
            {
              name,
              description,
              location: {
                  type: 'Point',
                  coordinates: [longitude, latitude],
              },
          },
          { new: true }
      );
        res.json(place);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Endpoint para eliminar un lugar
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await Place.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lugar eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;