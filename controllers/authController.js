const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

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