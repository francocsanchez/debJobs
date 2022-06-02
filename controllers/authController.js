const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const Usuario = mongoose.model('Usuario');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/users/panel',
    failureRedirect: '/users/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

exports.verificarUsuario = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/users/iniciar-sesion')
}

exports.showPanel = async (req, res) => {
    const vacantes = await Vacante.find({ author: req.user._id }).lean();
    res.render('users/showPanel', {
        nombrePagina: 'Panel de administracion',
        tagline: 'Administra tus vacantes desde aqui',
        cerrarSesion: true,
        userName: req.user.name,
        imgProfile: req.user.imgProfile,
        vacantes
    })
}

exports.cerrarSesion = (req, res) => {
    req.logout();
    req.flash('correcto', 'Cerraste Sesión Correctamente');
    return res.redirect('/');
}

exports.formReestablecerPassword = (req, res) => {
    res.render('users/restablecerPass', {
        nombrePagina: 'Reestablece tu Password',
        tagline: 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email'
    })
}

exports.sendToken = async (req, res) => {
    const user = await Usuario.findOne({ email: req.body.email });

    if (!user) {
        req.flash('error', 'No existe esa cuenta')
        return res.redirect('/users/iniciar-sesion')
    };

    user.token = crypto.randomBytes(20).toString('hex');
    user.expira = Date.now() + 3600000;

    await user.save();
    const resetUrl = `http://${req.headers.host}/users/reset-password/${user.token}`

    await enviarEmail.enviar({
        user,
        subjet: 'Reseteo de password',
        resetUrl,
        file: 'reset'
    })

    req.flash('correcto', 'Verifica tu cuenta de correo')
    return res.redirect('/users/iniciar-sesion')
}

exports.validarToken = async (req, res) => {
    const user = await Usuario.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });

    if (!user) {
        req.flash('error', 'Token expirado, solicitar uno nuevo');
        return res.redirect('/users/reset-password');
    }

    res.render('users/newPassword', {
        nombrePagina: 'Nuevo Password',
        tagline: 'Administra tus vacantes desde aqui',
    })
}

exports.guardarPassword = async (req, res) => {
    const user = await Usuario.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    });

    if (!user) {
        req.flash('error', 'Token expirado, solicitar uno nuevo');
        return res.redirect('/users/reset-password');
    }

    user.password = req.body.password;
    user.token = undefined;
    user.expira = undefined;

    await user.save();

    req.flash('correcto', 'Password modificado')
    return res.redirect('/users/iniciar-sesion')
}