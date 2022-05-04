var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser")
router.use(cookieParser())

//Creamos el objeto para definir las rutas

//Importamos el modelo que ejecutará las sentencias SQL
var vuelosControler = require('../controllers/controlador_vuelos');
var authController = require('../controllers/controlador_auth')
var userController = require('../controllers/controlador_usuarios')

//Todos los vuelos
router.get('/api/vuelos', vuelosControler.getVuelos)

// Vuelo por fecha
router.get('/api/vuelosCOM:fechita', vuelosControler.getVuelosCOMByFecha)

// Registro usuario
router.post('/api/registro', authController.registro)

// Reserva vuelo
router.post('/api/usuario/reserva', userController.reservarVuelo)

// Login
router.post('/api/login', authController.login)

// logout
router.get('/api/logout', authController.logout)

//Obtener usuario id
router.get('/api/usuario', userController.obtenerUsuario)

router.get('/api/compCookie:name', authController.comprobarCookie)

module.exports = router