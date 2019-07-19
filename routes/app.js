const express = require('express');

const app = express();

//rutas

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true
    });

});


module.exports = app;