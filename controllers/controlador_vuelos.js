
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
    let query = 'SELECT id_vuelo, fecha, tipo_vuelo, orbita_destino FROM `vuelos` WHERE fecha > ? AND tipo_vuelo = "COM" ORDER BY fecha';
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
