var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser")
router.use(cookieParser())

//Creamos el objeto para definir las rutas

//Importamos el modelo que ejecutará las sentencias SQL
var vuelosControler = require('../controllers/controlador_vuelos');
var authController = require('../controllers/controlador_auth')

//Todos los vuelos
router.get('/api/vuelos', vuelosControler.getVuelos)

// Vuelo por fecha
router.get('/api/vuelosCOM:fechita', vuelosControler.getVuelosCOMByFecha)

// Registro usuario
router.post('/api/registro', authController.registro)

// Login
router.post('/api/login', authController.login)

module.exports = router