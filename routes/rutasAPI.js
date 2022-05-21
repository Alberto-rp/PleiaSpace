var express = require('express');
var router = express.Router();
const cookieParser = require("cookie-parser")
router.use(cookieParser())
const multer = require('multer')

// // Seteamos el almacenamiento de multer
var storage = multer.diskStorage({
    destination: 'uploads/',

    filename: function (req, file, cb) {
      cb(null, 'Curriculum'+'-'+Date.now()+file.originalname)
    }
})

const upload = multer({
   storage: storage,
   limits: {
    fieldSize: 1024 * 256, //Esto equivale a 512 KB
    fieldNameSize: 200
  },
})

//Creamos el objeto para definir las rutas

//Importamos el modelo que ejecutará las sentencias SQL
var vuelosControler = require('../controllers/controlador_vuelos');
var authController = require('../controllers/controlador_auth')
var userController = require('../controllers/controlador_usuarios')
var fileController = require('../controllers/controlador_files')
var vehicleController = require('../controllers/controlador_vehiculos')
var companyController = require('../controllers/controlador_company')


/* VUELOS */
//Todos los vuelos
router.get('/api/vuelos', vuelosControler.getVuelos)

// Vuelo por fecha
router.get('/api/vuelosCOM:fechita', vuelosControler.getVuelosCOMByFecha)

// Vuelo por id Usuario
router.get('/api/vuelos/usuario:id',vuelosControler.getvuelosUsuario)

//Vuelos carga
router.post('/api/vuelosCAR', vuelosControler.getVuelosCarga)

//Reservar vuelo carga
router.post('/api/reservaCarga', vuelosControler.reservarVueloCarga)

//Cancelar vuelo carga
router.get('/api/cancelar', vuelosControler.cancelarVueloCarga)


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
router.post('/api/file', upload.single('cv'), fileController.subirCurriculum)

/*VEHICULOS */
//Devolver vehiculo nombre
router.get('/api/vehiculos:name', vehicleController.devolverDatosVehiculo)

/*COMPÑIAS */
//Devolver compañia
router.get('/api/company:name', companyController.getCompany)

//Devolver datos comañia y contactos
router.post('/api/company/data', companyController.getDataCompany)




module.exports = router