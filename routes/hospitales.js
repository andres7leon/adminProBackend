const express = require('express');
const app = express();
const Hospitales = require('../models/hospital');
const verificaToken = require('../middlewares/autenticacion').verificaToken;


app.get('/', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Hospitales.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, data) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                    mensaje: 'Error en servidor'
                })
            }

            res.status(200).json({
                ok: true,
                data
            });

        });
});

app.post('/', verificaToken, (req, res) => {

    let body = req.body;

    let hospital = new Hospitales({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, data) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: { mensaje: 'Error al crear Hospital' },
                mensaje: 'Error al crear Hospital'
            })
        }

        res.status(201).json({
            ok: true,
            data
        })

    });


});

app.put('/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Hospitales.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err,
                mensaje: 'Error en servidor'
            })
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontro ningun hospital con este id'
            })
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, data) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err,
                    mensaje: 'Error en servidor'
                })
            }

            res.status(200).json({
                ok: true,
                data
            })

        });


    });



});

app.delete('/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Hospitales.findByIdAndDelete(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err,
                mensaje: 'Error en servidor'
            })
        }

        if (!hospital) {

            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontro ningun hospital con este id'
            })

        }

        res.status(200).json({
            ok: true,
            data: hospital
        });

    });

});


module.exports = app;