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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://alediaz709:alediaz709@cluster25712.yhv9vg7.mongodb.net/?retryWrites=true&w=majority&appName=cluster25712';
mongoose.connect(MONGODB_URI)
        .then(() => {console.log('Connected to MongoDB');})
        .catch((error) => {console.error('Connection failed! ' + error);});

app.listen(port, () => {
    console.log("My server is working on: " + `http://localhost:${port}`);
});

module.exports = app;