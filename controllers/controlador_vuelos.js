
var pool = require('../DataBase/conection')

var vuelos = {}

vuelos.getVuelos = function(request, response){
    pool.query('SELECT id_vuelo, fecha, tipo_vuelo, orbita_destino FROM `vuelos` ORDER BY fecha', (error, results) => {
        if(error){console.log(error)}
        response.status(200).json(results)
    })
}

vuelos.getVuelosCOMByFecha = function(request, response){
    const fechaP = request.params.fechita;
    let fecha = new Date(fechaP)

    let query = 'SELECT vuelos.id_vuelo, fecha, tipo_vuelo, orbita_destino, asientos_disponibles FROM `vuelos`, `vuelos_comerciales` WHERE fecha > ? AND tipo_vuelo = "COM" AND vuelos.id_vuelo = vuelos_comerciales.id_vuelo  ORDER BY fecha;'
    pool.query(query, [fecha], (error, results) => {
        if(error){console.log(error)}
        response.status(200).json(results)
    })

}

module.exports = vuelos
