var express = require('express');
const url = require('url')
const path = require('path')
var router = express.Router();

//Creamos el objeto para definir las rutas

//Importamos el modelo que ejecutará las sentencias SQL
var vuelosControler = require('../controllers/controlador_vuelos');

//Todos los vuelos
router.get('/', function(request, response){
    response.render('index')
})

//Todos los vuelos
router.get('/api/vuelos', function(request, response){
    vuelosControler.getVuelos(function(error, data){
        response.status(200).json(data)
    })
})


router.get('/vuelosCOM', function(request, response){
    const ObjetoParametros = url.parse(request.url, true).query;
    response.redirect("reserva_asiento.html?fechaIn="+encodeURI(ObjetoParametros.fechaIn))
    // let fecha = new Date(ObjetoParametros.fechaIn)

    // vuelosControler.getVuelosCOMByFecha(fecha, function(error, data){
        // response.status(200).json(data)
    // })
})


//API ROUTES

router.get('/api/vuelosCOM:fechita', function(request, response){
    // const ObjetoParametros = url.parse(request.url, true).query;
    // let fecha = new Date(ObjetoParametros.fechaIn)
    const fechaP = request.params.fechita;
    console.log(fechaP)
    let fecha = new Date(fechaP)

    vuelosControler.getVuelosCOMByFecha(fecha, function(error, data){
        response.status(200).json(data)
    })
})

module.exports = router