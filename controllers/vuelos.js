
// var mysql = require('mysql')
var pool = require('../DataBase/conection')

var vuelos = {}

vuelos.getVuelos = function(callback){
    pool.query('SELECT id_vuelo, fecha, tipo_vuelo, orbita_destino FROM `vuelos` ORDER BY fecha', function (error, result){
        if(error){
            throw error
        }
        else{
            callback(null, result)
        }

    })
}

module.exports = vuelos
