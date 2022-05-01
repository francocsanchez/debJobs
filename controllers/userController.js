const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

exports.formCrearCuenta = (req, res) => {
    res.render('users/crearCuenta', {
        nombrePagina: 'Crear tu cuenta',
        tagline: 'Comienza a publicar tus vacantes gratis'
    });
}

exports.crearCuenta = async (req, res) => {
    const user = new Usuario(req.body)
    const newUser = await user.save();

    if(!newUser) return next();

    res.redirect('/users/inicar-sesion');
}