const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mdAutenticacion = require('../middlewares/autenticacion');
const app = express();



const Usuario = require('../models/usuario');

/* -------------------------------------------------------------------------- */
/*                         obtener todos los usuarios                         */
/* -------------------------------------------------------------------------- */

app.get('/', (req, res, next) => {


    Usuario.find({}, 'nombre')
        .exec((err, data) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                data
            })

        })

});

/* -------------------------------------------------------------------------- */
/*                             actualizar usuario                             */
/* -------------------------------------------------------------------------- */

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err, data) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el usuario',
                err
            })
        }

        if (!data) {

            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el id ${id} no existe`,
                err: { mensaje: `El usuario con el id ${id} no existe` }
            })

        }

        data.nombre = body.nombre;
        data.email = body.email;
        data.role = body.role;

        data.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    err
                })
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                data: usuarioGuardado,
                dataToken: req.usuario
            })

        });

    });

});


/* -------------------------------------------------------------------------- */
/*                              crear un usuario                              */
/* -------------------------------------------------------------------------- */

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.password,
        role: body.role
    })

    usuario.save((err, data) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            })

        }

        res.status(201).json({
            ok: true,
            data
        })

    });


});


/* -------------------------------------------------------------------------- */
/*                         Eliminar usuario por el id                         */
/* -------------------------------------------------------------------------- */

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, data) => {

        if (err) {

            return res.status(500).json({
                ok: false,
                err
            })

        }

        if (!data) {

            return res.status(400).json({
                ok: false,
                mensaje: 'No existe ningun usuario con ese ID',
                err: { mensaje: 'No existe ningun usuario con ese ID', }
            })

        }

        res.status(200).json({
            ok: true,
            data
        })

    });

});


module.exports = app;