exports.nuevaVacante = (req, res) => {
    res.render('vacantes/nuevaVacante', {
        nombrePagina: 'Nueva vacante',
        tagline: 'Completa el formulario',
    })
}