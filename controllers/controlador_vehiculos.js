var pool = require('../DataBase/conection')

// Devolver vuelos por nombre
exports.devolverDatosVehiculo = async (request, response) =>{
    let nombreVehiculo = request.params.name;
    pool.query('SELECT * FROM `vehiculos` WHERE ?',{nombre_vehiculo: nombreVehiculo}, (error, results) => {
        if(error){console.log(error)}
        response.status(200).json(results)
    })
}