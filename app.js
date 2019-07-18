// Requires 
const express = require('express');
const mongoose = require('mongoose');

//inicializar variables
const app = express();


mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log("base de datos conectada 2");
});


//rutas

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true
    });

});


//Escuchar Express

app.listen(3000, () => {
    console.log('Express escuchando puerto 3000:');
});