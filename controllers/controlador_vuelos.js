
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

vuelos.getVuelosCOMByFecha = function(fecha, callback){
    let query = 'SELECT vuelos.id_vuelo, fecha, tipo_vuelo, orbita_destino, asientos_disponibles FROM `vuelos`, `vuelos_comerciales` WHERE fecha > ? AND tipo_vuelo = "COM" AND vuelos.id_vuelo = vuelos_comerciales.id_vuelo  ORDER BY fecha;';
    pool.query(query, fecha, function (error, result){
        if(error){
            throw error
        }
        else{
            callback(null, result)
        }

    })
}

module.exports = vuelos
