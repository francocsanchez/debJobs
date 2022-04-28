const express = require('express');
const router = express.Router()

const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');

module.exports = () => {
    router.get('/', homeController.listJobs);

    router.get('/vacantes/nueva', vacantesController.nuevaVacante);
    router.post('/vacantes/nueva', vacantesController.addVacante);
    router.get('/vacantes/:url', vacantesController.showVacante);

    return router;
}