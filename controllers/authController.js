const passport = require('passport');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/ok',
    failureRedirect: '/users/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

exports.verificarUsuario = (req,res,next) => {
    if(req.authenticate()){
        return next()
    }

    res.redirect('/users/iniciar-sesion')
}

exports.showPanel = (req, res) => {
    res.render('users/showPanel', {
        nombrePagina: 'Panel de administracion',
        tagline: 'Administra tus vacantes desde aqui'
    })
}