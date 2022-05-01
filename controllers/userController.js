exports.formCrearCuenta = (req, res) => {
    res.render('users/crearCuenta', {
        nombrePagina: 'Crear tu cuenta',
        tagline: 'Comienza a publicar tus vacantes gratis'
    });
}