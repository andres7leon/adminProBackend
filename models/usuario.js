const mogoose = require('mongoose');

const Schema = mogoose.Schema;

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Contraseña requerida']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    }
});

module.exports = mogoose.model('Usuario', usuarioSchema);