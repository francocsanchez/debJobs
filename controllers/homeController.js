exports.listJobs = (req, res) => {
    res.render('home', {
        nombrePagina: 'DevJobs',
        tagline: 'Encuentra tu proximo trabajo como desarrollador',
        barra: true,
        boton: true
    })
}