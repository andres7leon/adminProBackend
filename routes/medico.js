const express = require('express');
const app = express();
const Medico = require('../models/medico');
const verificaToken = require('../middlewares/autenticacion').verificaToken;

app.get('/', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5)
        .exec((err, data) => {

            if (err) {
                return res.status(500).json({
                    err,
                    mensaje: 'Error en el servidor',
                    ok: false
                });
            }

            Medico.count({}, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    data,
                    total: conteo
                });
            })

        });

});

app.post('/', verificaToken, (req, res) => {

    let body = req.body;

    let medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medico) => {
        if (err) {
            return res.status(400).json({
                err,
                mensaje: 'Error al crear el hospital',
                ok: false
            });
        }

        res.status(201).json({
            ok: true,
            data: medico
        })
    })

});

app.put('/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                err,
                mensaje: 'Error en el servidor',
                ok: false
            });
        }

        if (!medico) {
            return res.status(401).json({
                ok: false,
                err: { mensaje: 'No se encontro ningun hospital con este id' },
                mensaje: 'No se encontro ningun hospital con este id'
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;;
        medico.medico = body.medico

        medico.save((err, medicoUpdate) => {

            if (err) {
                return res.status(500).json({
                    err,
                    mensaje: 'Error en el servidor',
                    ok: false
                });
            }

            res.status(200).json({
                ok: true,
                data: medicoUpdate
            })

        });


    })

});

app.delete('/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Medico.findByIdAndDelete(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                err,
                mensaje: 'Error en el servidor',
                ok: false
            });
        }

        if (!medico) {
            return res.status(400).json({
                err: { mensaje: 'No se encontro ningun medico' },
                ok: false,
                mensaje: 'No se encontro ningun medico'
            })
        }

        res.status(200).json({
            ok: true,
            data: medico
        })

    })

});







module.exports = app;