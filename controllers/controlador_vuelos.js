
var pool = require('../DataBase/conection')

var vuelos = {}

vuelos.getVuelos = function(request, response){
    pool.query('SELECT id_vuelo, fecha, tipo_vuelo, orbita_destino, lanzador FROM `vuelos` ORDER BY fecha', (error, results) => {
        if(error){console.log(error)}
        response.status(200).json(results)
    })
}

vuelos.getvuelosUsuario = function(request, response){
    const idUser = request.params.id;
    let query = 'SELECT v.id_vuelo, orbita_destino, fecha, asientos_reservados, metodo_pago, vc.precio_asiento FROM vuelos v, reserva_asiento ra, vuelos_comerciales vc WHERE v.id_vuelo = ra.id_vuelo AND v.id_vuelo = vc.id_vuelo AND ra.id_usuario = ?'
    pool.query(query, [idUser], (error, results) => {
        if(error){console.log(error)}
        response.status(200).json(results)
    })
}

vuelos.getVuelosCOMByFecha = function(request, response){
    const fechaP = request.params.fechita;
    let fecha = new Date(fechaP)

    let query = 'SELECT vuelos.id_vuelo, fecha, tipo_vuelo, orbita_destino, asientos_disponibles, precio_asiento FROM `vuelos`, `vuelos_comerciales` WHERE fecha > ? AND tipo_vuelo = "COM" AND vuelos.id_vuelo = vuelos_comerciales.id_vuelo  ORDER BY fecha;'
    pool.query(query, [fecha], (error, results) => {
        if(error){console.log(error)}
        response.status(200).json(results)
    })

}
module.exports = vuelos
