var express = require('express');
const url = require('url')
const path = require('path')
var router = express.Router();

//Creamos el objeto para definir las rutas

//Importamos el modelo que ejecutará las sentencias SQL
var vuelosControler = require('../controllers/vuelos');

//Todos los vuelos
router.get('/vuelos', function(request, response){
    vuelosControler.getVuelos(function(error, data){
        response.status(200).json(data)
    })
})


router.get('/vuelosCOM', function(request, response){
    const ObjetoParametros = url.parse(request.url, true).query;
    let fecha = new Date(ObjetoParametros.fechaIn)

    vuelosControler.getVuelosCOMByFecha(fecha, function(error, data){
        response.status(200).json(data)
        // response.render('reserva_asiento.html')
        // response.sendFile(path.join(__dirname, 'reserva_asiento.html'));
    })
})

module.exports = router