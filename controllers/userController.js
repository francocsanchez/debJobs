const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const { validationResult } = require('express-validator');

exports.formCrearCuenta = (req, res) => {
    res.render('users/crearCuenta', {
        nombrePagina: 'Crear tu cuenta',
        tagline: 'Comienza a publicar tus vacantes gratis',
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

exports.formEditProfile = (req, res) => {
    res.render('users/editProfile', {
        nombrePagina: 'Edita tu perfil de DevJobs',
        user: req.user.toObject(),
        cerrarSesion: true,
        userName: req.user.name,
    })
}

exports.editProfile = async (req, res) => {
    const user = await Usuario.findById(req.user._id);

    user.name = req.body.name;
    user.email = req.body.email;

    if (req.body.password) { user.password = req.body.password }

    if (req.file) { user.imgProfile = req.file.filename }

    await user.save();

    req.flash('correcto', 'Datos guardados correctamente');

    res.redirect('/users/panel')
}