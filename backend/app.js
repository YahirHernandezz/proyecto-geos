const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const places = require('./routes/places');
const zones = require('./routes/zones');
const cases = require('./routes/cases');
const resources = require('./routes/resources');
const auth = require('./routes/auth');
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/auth', auth);
app.use('/api/places', places);
app.use('/api/zones', zones);
app.use('/api/cases', cases);
app.use('/api/resources', resources);

// Conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI no está definida en el archivo .env');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
        .then(() => {console.log('✓ Conectado a MongoDB exitosamente');})
        .catch((error) => {
            console.error('✗ Error al conectar a MongoDB:', error.message);
            process.exit(1);
        });

app.listen(port, () => {
    console.log("My server is working on: " + `http://localhost:${port}`);
});

module.exports = app;