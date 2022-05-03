const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const { validationResult } = require('express-validator');

exports.formCrearCuenta = (req, res) => {
    res.render('users/crearCuenta', {
        nombrePagina: 'Crear tu cuenta',
        tagline: 'Comienza a publicar tus vacantes gratis'
    });
}

exports.crearCuenta = async (req, res) => {
    const validation = validationResult(req);

    if (validation.errors.length > 0) {
        req.flash('error', validation.errors.map(error => error.msg));
        return res.render('users/crearCuenta', {
            nombrePagina: 'Crear tu cuenta',
            tagline: 'Comienza a publicar tus vacantes gratis',
            mensajes: req.flash()
        });
    }

    const user = new Usuario(req.body)
    try {
        const newUser = await user.save();
        res.redirect('/users/inicar-sesion');
    } catch (error) {
        req.flash('error', error)
        res.redirect('/users/crear-cuenta')
    }
}

exports.iniciarSesion = (req, res) => {
    res.render('users/iniciarSesion', {
        nombrePagina: 'Iniciar sesion en devJobs'
    });
}