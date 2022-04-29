var express = require('express');
const url = require('url')
const path = require('path')
var router = express.Router();

//Creamos el objeto para definir las rutas

//Importamos el modelo que ejecutará las sentencias SQL
var vuelosControler = require('../controllers/controlador_vuelos');

//Todos los vuelos
router.get('/api/vuelos', function(request, response){
    vuelosControler.getVuelos(function(error, data){
        response.status(200).json(data)
    })
})


router.get('/api/vuelosCOM:fechita', function(request, response){
    // const ObjetoParametros = url.parse(request.url, true).query;
    // let fecha = new Date(ObjetoParametros.fechaIn)
    const fechaP = request.params.fechita;
    let fecha = new Date(fechaP)

    vuelosControler.getVuelosCOMByFecha(fecha, function(error, data){
        response.status(200).json(data)
    })
})

module.exports = router