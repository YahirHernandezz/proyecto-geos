const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const places = require('./routes/places');
const zones = require('./routes/zones');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api/places', places);
app.use('/api/zones', zones);

// Conexión a MongoDB
mongoose.connect('mongodb+srv://yahir16hdz:contrasena@cluster712.kfosuxr.mongodb.net/productsDB?retryWrites=true&w=majority')
    .then(() => {console.log('Connected to MongoDB');})
    .catch((error) => {console.error('Connection failed! ' + error);});

app.listen(port, () => {
console.log("My server is working on: " + `http://localhost:${port}`);
});

module.exports = app;