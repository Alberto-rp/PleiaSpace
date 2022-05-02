var express = require('express');
const url = require('url')
const path = require('path')
var router = express.Router();
const cookieParser = require("cookie-parser")
router.use(cookieParser())
const authController = require('../controllers/controlador_auth')

//Importamos el modelo que ejecutará las sentencias SQL


// router.get('/vuelosCOM', function(request, response){
//     const ObjetoParametros = url.parse(request.url, true).query;
//     response.redirect("reserva_asiento.html?fechaIn="+encodeURI(ObjetoParametros.fechaIn))
//     // let fecha = new Date(ObjetoParametros.fechaIn)

//     // vuelosControler.getVuelosCOMByFecha(fecha, function(error, data){
//         // response.status(200).json(data)
//     // })
// })

router.get('/calendario', function(request, response){
    response.sendFile(path.join(__dirname + '/../public/calendario.html'));
})

router.get('/vuela', authController.isAutentic, function(request, response){
    response.sendFile(path.join(__dirname + '/../public/vuelo_comercial.html'));
})

router.get('/login', function(request, response){
    response.sendFile(path.join(__dirname + '/../public/login.html'))
})

router.get('/registro', function(request, response){
    response.sendFile(path.join(__dirname + '/../public/registro.html'))
    // response.redirect('/registro')
})

module.exports = router