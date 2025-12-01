const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    disease: {
        type: String,
        required: true
    },
    caseCount: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    status: {
        type: String,
        required: false,
        enum: ['Activo', 'Controlado', 'Cerrado'],
        default: 'Activo'
    },
    sourcePlace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zone',
        required: false
    },
    description: {
        type: String,
        required: false
    }
});

caseSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Case', caseSchema);
