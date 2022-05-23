const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const { validationResult } = require('express-validator');

exports.nuevaVacante = (req, res) => {
    if (req.session) {
        req.session.cookie.maxAge = 0
        delete req.session
    }
    console.log(req.session);
    res.render('vacantes/nuevaVacante', {
        nombrePagina: 'Nueva vacante',
        tagline: 'Completa el formulario',
        cerrarSesion: true,
        userName: req.user.name,
    })
}

exports.addVacante = async (req, res) => {
    const validation = validationResult(req);

    if (validation.errors.length > 0) {
        req.flash('error', validation.errors.map(error => error.msg));
        return res.render('vacantes/nuevaVacante', {
            nombrePagina: 'Nueva vacante',
            tagline: 'Completa el formulario',
            mensajes: req.flash(),
            cerrarSesion: true,
            userName: req.user.name,
        });
    }

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
        cerrarSesion: true,
        userName: req.user.name,
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

exports.deleteVacante = async (req, res) => {
    const { id } = req.params;

    const vacante = await Vacante.findById(id);

    console.log(vacante);

    if (vacante.author.equals(req.user._id)) {
        vacante.remove();
        res.status(200).send('Vacante eliminada correctamente')
    } else {
        res.status(403).send('Error')
    }
}