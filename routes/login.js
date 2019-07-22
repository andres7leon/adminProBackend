const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
const app = express();

const Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, data) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err,
                mensaje: 'Error al buscar usuarios'
            })

        }

        if (!data) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email'
            })
        }

        if (!bcrypt.compareSync(body.password, data.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password'
            })
        }

        /* ------------------------------- crear token ------------------------------ */

        data.password = ':)';

        let token = jwt.sign({ usuario: data }, SEED, { expiresIn: 14400 }) // 4 horas

        res.status(200).json({
            ok: true,
            mensaje: 'login correcto',
            data: body,
            token
        });



    });



});


module.exports = app;