const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    resourceType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    },
    status: {
        type: String,
        required: false,
        enum: ['Disponible', 'Escaso', 'Agotado'],
        default: 'Disponible'
    },
    placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zone',
        required: false
    },
    notes: {
        type: String,
        required: false
    }
});

resourceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Resource', resourceSchema);
