
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

vuelos.getVuelosCarga = function(request, response){
    const orb = request.body.orbita
    const fecha = new Date(request.body.fecha)

    let query = 'SELECT v.id_vuelo, fecha, orbita_destino, lanzador, precio_kg, disp_port_A, disp_port_B FROM `vuelos` v, `vuelos_carga` vc WHERE fecha > ? AND tipo_vuelo = "CAR" AND orbita_destino = ? AND v.id_vuelo = vc.id_vuelo  ORDER BY fecha;'
    pool.query(query, [fecha, orb], (error, results) => {
        if(error){console.log(error)}
        response.status(200).json(results)
    })

}

vuelos.reservarVueloCarga = (request, response) =>{
    console.log(request.body)

    // Datos reserva
    let idVuelo = request.body.id
    let peso = request.body.peso
    let cost = request.body.coste
    let port = request.body.puerto
    

    // Datos addons
    let seguro = 0
    let electr = 0
    let adapt = 0
    let fuel = 0
    if(request.body.addonsSEL != undefined){
        for(item of request.body.addonsSEL){
            switch(item){
                case'seguro':
                    seguro = 1
                    break
                case'elect':
                    electr = 1
                    break
                case'adapt':
                    adapt = 1
                    break
                case'fuel':
                    fuel = 1
                    break
            }
        }
    }
    // console.log(seguro+" "+electr+" "+adapt+" "+fuel)

    // Datos compañia
    let nombreComp = request.body.datosComp[0]
    let adressComp = request.body.datosComp[1]
    let cityComp = request.body.datosComp[2]
    let provComp = request.body.datosComp[3]
    let cosPostComp = request.body.datosComp[4]
    let countryComp = request.body.datosComp[5]

    // console.log(nombreComp+" "+idVuelo+" "+provComp)

}
module.exports = vuelos
