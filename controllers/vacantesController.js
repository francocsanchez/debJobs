const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const { validationResult } = require('express-validator');
const multer = require('multer')
const shortid = require('shortid')

exports.nuevaVacante = (req, res) => {
    if (req.session) {
        req.session.cookie.maxAge = 0
        delete req.session
    }
    res.render('vacantes/nuevaVacante', {
        nombrePagina: 'Nueva vacante',
        tagline: 'Completa el formulario',
        cerrarSesion: true,
        userName: req.user.name,
        imgProfile: req.user.imgProfile,
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
            imgProfile: req.user.imgProfile,
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
    const vacante = await Vacante.findOne({ url: req.params.url }).lean().populate('author');

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
        imgProfile: req.user.imgProfile,
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

    if (vacante.author.equals(req.user._id)) {
        vacante.remove();
        res.status(200).send('Vacante eliminada correctamente')
    } else {
        res.status(403).send('Error')
    }
}

exports.subirCV = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: Máximo 100kb ');
                } else {
                    req.flash('error', error.message);
                }
            } else {
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            return next();
        }
    });
}

const configuracionMulter = {
    limits: { fileSize: 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../public/cv');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'application/pdf') {
            // el callback se ejecuta como true o false : true cuando la imagen se acepta
            cb(null, true);
        } else {
            cb(new Error('Formato No Válido'));
        }
    }
}

const upload = multer(configuracionMulter).single('cv');

exports.contactar = async (req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.url });

    if (!vacante) { return next() };

    const nuevoCandidato = {
        name: req.body.name,
        email: req.body.email,
        cv: req.file.filename
    }

    vacante.candidates.push(nuevoCandidato);
    await vacante.save()

    req.flash('correcto', 'Se envio tu cv correctamente');
    res.redirect('/');
}

exports.showCandidatos = async (req, res, next) => {
    const vacante = await Vacante.findById(req.params.id).lean()

    if (vacante.author != req.user._id.toString()) {
        return next();
    }

    if (!vacante) { return next() }

    res.render('vacantes/showCandidatos', {
        nombrePagina: `Candidatos de vacante - ${vacante.title}`,
        tagline: `#id: ${vacante._id}`,
        cerrarSesion: true,
        userName: req.user.name,
        imgProfile: req.user.imgProfile,
        candidatos: vacante.candidates
    })
}