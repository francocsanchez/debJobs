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

    vacante.author = req.user._id;

    const skillsVacante = req.body.skills.split(',');
    vacante.skills = skillsVacante;

    const nuevaVacante = await vacante.save();

    res.redirect(`/vacantes/${nuevaVacante.url}`);
}

exports.showVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    if (!vacante) return next();

    res.render('vacantes/showVacante', {
        vacante,
        nombrePagina: vacante.title,
        barra: true
    })
}

exports.editFormVacante = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url }).lean();

    if (!vacante) return next();

    res.render('vacantes/editVacante', {
        vacante,
        nombrePagina: `Editar - ${vacante.title}`,
        tagline: `#id: ${vacante._id}`,
    })
}

exports.updateVacante = async (req, res) => {
    const updateVacante = req.body;
    updateVacante.skills = req.body.skills.split(',');

    const vacante = await Vacante.findOneAndUpdate({ url: req.params.url }, updateVacante, {
        new: true,
        runValidators: true
    });

    res.redirect(`/vacantes/${vacante.url}`);
}