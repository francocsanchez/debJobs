const express = require('express');
const router = express.Router()
const { body } = require('express-validator');
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

const validationUser = [
    body('name').notEmpty().withMessage('El campo nombre no debe estar vacío'),
    body('email').notEmpty().withMessage('El campo email no debe estar vacío'),
    body('email').custom(email => {
        return Usuario.findOne({ email: email }).then(user => {
            if (user) {
                return Promise.reject('E-mail ya existe');
            }
        });
    }),
    body('password').notEmpty().withMessage('El campo password no debe estar vacío'),
    body('password2').notEmpty().withMessage('El campo comfirmar password no debe estar vacío'),
    body('password2').custom((value, { req }) => {
        if (value !== req.body.password) { throw new Error('Los password no coinciden'); }
        return true;
    }),
];

const validationVacantes = [
    body('name').notEmpty().trim().escape().withMessage('El campo titulo no debe estar vacío'),
    body('company').notEmpty().trim().escape().withMessage('El campo empresa no debe estar vacío'),
    body('location').notEmpty().trim().escape().withMessage('El campo ubicacion no debe estar vacío'),
    body('salary').custom(salary => {
        if (!isNaN(salary)) {
            if (salary < 0) { throw new Error('El valor del salario no puede ser menor a 0') }
        } else { throw new Error('El campo salario solo admite numeros') }
        return true;
    }),
    body('contract').notEmpty().trim().escape().withMessage('El campo ubicacion no debe estar vacío'),
]

const validationProfile = [
    body('name').notEmpty().trim().escape().withMessage('El campo nombre no debe estar vacío'),
    body('email').notEmpty().trim().escape().withMessage('El campo email no debe estar vacío'),
]

const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

module.exports = () => {
    router.get('/', homeController.listJobs);

    router.get('/vacantes/nueva', authController.verificarUsuario, vacantesController.nuevaVacante);
    router.post('/vacantes/nueva', authController.verificarUsuario, validationVacantes, vacantesController.addVacante);
    router.get('/vacantes/:url', vacantesController.showVacante);
    router.get('/vacantes/edit/:url', authController.verificarUsuario, vacantesController.editFormVacante);
    router.post('/vacantes/edit/:url', authController.verificarUsuario, validationVacantes, vacantesController.updateVacante);

    router.get('/users/panel', authController.verificarUsuario, authController.showPanel);

    router.get('/users/cerrar-sesion', authController.verificarUsuario, authController.cerrarSesion);
    router.get('/users/crear-cuenta', userController.formCrearCuenta);
    router.post('/users/crear-cuenta', validationUser, userController.crearCuenta);
    router.get('/users/iniciar-sesion', userController.iniciarSesion);
    router.post('/users/iniciar-sesion', authController.autenticarUsuario);

    router.get('/users/edit-profile', authController.verificarUsuario, userController.formEditProfile)
    router.post('/users/edit-profile', authController.verificarUsuario,  validationProfile ,userController.editProfile)

    return router;
}