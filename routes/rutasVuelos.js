var express = require('express');
//Creamos el objeto para definir las rutas
var router = express.Router();

//Importamos el modelo que ejecutará las sentencias SQL
var vuelosControler = require('../controllers/vuelos');

//Todos los vuelos
router.get('/vuelos', function(request, response){
    vuelosControler.getVuelos(function(error, data){
        response.status(200).json(data)
    })
})

module.exports = router