var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser")
router.use(cookieParser())
// const multer = require('multer')

// // Seteamos el almacenamiento de multer
// var storage = multer.diskStorage({
//     // destination: __dirname + '../uploads',

//     filename: function (req, file, cb) {
//         let nombre = req.body.name
//       cb(null, nombre+'-'+Date.now()+file.originalname)
//     }
// })

// const upload = multer({
//     storage: storage
// })

//Creamos el objeto para definir las rutas

//Importamos el modelo que ejecutará las sentencias SQL
var vuelosControler = require('../controllers/controlador_vuelos');
var authController = require('../controllers/controlador_auth')
var userController = require('../controllers/controlador_usuarios')
var fileController = require('../controllers/controlador_files')


/* VUELOS */
//Todos los vuelos
router.get('/api/vuelos', vuelosControler.getVuelos)

// Vuelo por fecha
router.get('/api/vuelosCOM:fechita', vuelosControler.getVuelosCOMByFecha)

// Vuelo por id Usuario
router.get('/api/vuelos/usuario:id',vuelosControler.getvuelosUsuario)


/* AUTH */
// Registro usuario
router.post('/api/registro', authController.registro)

// Login
router.post('/api/login', authController.login)

// logout
router.get('/api/logout', authController.logout)
// Comprobar cookie
router.get('/api/compCookie:name', authController.comprobarCookie)


/* USERS */
// Reserva vuelo
router.post('/api/usuario/reserva', userController.reservarVuelo)

//Obtener usuario id
router.get('/api/usuario', userController.obtenerUsuario)

// Eliminar reserva
router.post('/api/eliminarReserva', userController.eliminarReserva)

// Modificar reserva
router.post('/api/modificarReserva', userController.modificarReserva)

// Eliminar cuenta
router.post('/api/eliminarCuenta', userController.eliminarCuenta)


/*ARCHIVOS*/
//Trabaja con nosotros
router.post('/api/file', fileController.subirCurriculum)




module.exports = router