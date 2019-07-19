// Requires 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//inicializar variables
const app = express();

/* ------------------------------- body parse ------------------------------- */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* ----------------------------- importar rutas ----------------------------- */

let appRoutes = require('./routes/app');
let usuarioRoutes = require('./routes/usuario');

mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log("base de datos conectada 2");
});

/* ---------------------------------- rutas --------------------------------- */

app.use('/', appRoutes);
app.use('/usuario', usuarioRoutes)

//Escuchar Express

app.listen(3000, () => {
    console.log('Express escuchando puerto 3000:');
});