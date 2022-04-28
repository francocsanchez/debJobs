const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.nuevaVacante = (req, res) => {
    res.render('vacantes/nuevaVacante', {
        nombrePagina: 'Nueva vacante',
        tagline: 'Completa el formulario',
    })
}

exports.addVacante = async (req, res) => {
    const vacante = new Vacante(req.body);
    const skillsVacante = req.body.skills.split(',');
    const nuevaVacante = await vacante.save();

    res.redirect(`/vacantes/${nuevaVacante.url}`);
}