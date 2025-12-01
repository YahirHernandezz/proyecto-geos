const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const authenticateToken = require('../middleware/auth');

// Obtener todos los casos
router.get('/', authenticateToken, async (req, res) => {
    try {
        const cases = await Case.find().populate('sourcePlace', 'name');
        res.json(cases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener un caso específico
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id).populate('sourcePlace', 'name');
        if (!caseItem) {
            return res.status(404).json({ message: 'Caso no encontrado' });
        }
        res.json(caseItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Crear un nuevo caso
router.post('/', authenticateToken, async (req, res) => {
    const { disease, caseCount, severity, reportDate, latitude, longitude, status, affectedPopulation, sourcePlace, description } = req.body;

    try {
        const newCase = new Case({
            disease,
            caseCount,
            severity,
            reportDate: reportDate || Date.now(),
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            status: status || 'Activo',
            affectedPopulation,
            sourcePlace: sourcePlace || undefined,
            description
        });

        const savedCase = await newCase.save();
        res.status(201).json(savedCase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Actualizar un caso
router.put('/:id', authenticateToken, async (req, res) => {
    const { disease, caseCount, severity, reportDate, latitude, longitude, status, affectedPopulation, sourcePlace, description } = req.body;

    try {
        const caseItem = await Case.findById(req.params.id);

        if (!caseItem) {
            return res.status(404).json({ message: 'Caso no encontrado' });
        }

        caseItem.disease = disease;
        caseItem.caseCount = caseCount;
        caseItem.severity = severity;
        caseItem.reportDate = reportDate;
        caseItem.location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        };
        caseItem.status = status;
        caseItem.affectedPopulation = affectedPopulation;
        caseItem.sourcePlace = sourcePlace || undefined;
        caseItem.description = description;

        const updatedCase = await caseItem.save();
        res.json(updatedCase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar un caso
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id);

        if (!caseItem) {
            return res.status(404).json({ message: 'Caso no encontrado' });
        }

        await caseItem.deleteOne();
        res.json({ message: 'Caso eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener estadísticas de casos
router.get('/stats/summary', authenticateToken, async (req, res) => {
    try {
        const stats = await Case.aggregate([
            {
                $group: {
                    _id: '$disease',
                    totalCases: { $sum: '$caseCount' },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
