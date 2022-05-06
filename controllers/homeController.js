const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.listJobs = async (req, res) => {
    const vacantes = await Vacante.find({}).lean(); // Use lean() for data json
    res.render('home', {
        nombrePagina: 'DevJobs',
        tagline: 'Encuentra tu proximo trabajo como desarrollador',
        barra: true,
        boton: true,
        vacantes
    })
}