const express = require('express');
const router = express.Router()

const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const userController = require('../controllers/userController');

module.exports = () => {
    router.get('/', homeController.listJobs);

    router.get('/vacantes/nueva', vacantesController.nuevaVacante);
    router.post('/vacantes/nueva', vacantesController.addVacante);
    router.get('/vacantes/:url', vacantesController.showVacante);
    router.get('/vacantes/edit/:url', vacantesController.editFormVacante);
    router.post('/vacantes/edit/:url', vacantesController.updateVacante);

    router.get('/users/crear-cuenta', userController.formCrearCuenta);

    return router;
}