
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

    try {
        // Datos reserva
        let idVuelo = request.body.id
        let peso = request.body.peso
        let cost = request.body.coste
        let port = request.body.puerto

        // Variable auxiliar para realizar la ultima query
        let portModify
        if(port == 'A'){
            portModify = 'disp_port_A'
        }else if(port == 'B'){
            portModify = 'disp_port_B'
        }
        
    
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
        
        // Existe en BD
        let existeEnBD = request.body.datosComp[9]

        if(existeEnBD){
            let idComp = request.body.datosComp[10]

            pool.query('INSERT INTO reserva_puerto SET cod_comp = ?, ?',[idComp, {id_vuelo: idVuelo, puerto: port, peso: peso, precio: cost, seguro: seguro, electricidad: electr, fuel: fuel, adaptador: adapt}], (error, results) => {
                if(error){
                    console.log(error)
                    response.status(404).json({error : 'errorDesconocido'})
                }else{
                    //actualizamos vuelos_carga
                    pool.query(`UPDATE vuelos_carga SET ${portModify} = (${portModify} - 1) WHERE ?`,{id_vuelo: idVuelo}, (error, results) =>{
                        if(error){
                            console.log(error)
                            response.status(404).json({error : 'errorDesconocido'})
                            //ELIMINAR RESERVA SI UPDATEPUERTO FALLA
                        }else{
                            response.status(200).json({error : 'noerror'})
                        }
                    })
                }
            })
        }else{
            // Datos compañia
            let nombreComp = request.body.datosComp[0]
            let adressComp = request.body.datosComp[1]
            let cityComp = request.body.datosComp[2]
            let provComp = request.body.datosComp[3]
            let codPostComp = request.body.datosComp[4]
            let countryComp = request.body.datosComp[5]
    
            // Datos contacto
            let nombreContact = request.body.datosComp[6]
            let emailContact = request.body.datosComp[7]
            let telContact = request.body.datosComp[8]
    
            console.log(existeEnBD)
        
            // console.log(nombreComp+" "+idVuelo+" "+provComp)
        
            //INSERTAMOS COMPAÑIA
            pool.query('INSERT INTO companies SET ?',{nombre: nombreComp, direccion: adressComp, ciudad: cityComp, provincia: provComp, codigo_postal: codPostComp, pais: countryComp}, (error, results) => {
                if(error){
                    console.log(error)
                    response.status(404).json({error : 'nombreComp'})
                }else{//SI ES CORRECTO INSERTAMOS CONTACTO
                    pool.query('INSERT INTO contactos_comp SET cod_comp = (SELECT cod_comp FROM companies WHERE nombre = ?), ?',[nombreComp, {nombre: nombreContact, email: emailContact, telefono: telContact}], (error, results) => {
                        if(error){
                            console.log(error)
                            // ELIMINAR COMPAÑIA SI CONTACTO FALLA
                            pool.query('DELETE FROM companies WHERE ?',[{nombre: nombreComp}], (error, results2) => {
                                if(error){
                                    console.log(error)
                                    response.status(404).json({error : 'errorDesconocido'})
                                }else{
                                    response.status(404).json({error : 'contactoDuplicado'})
                                }
                            })
                        }else{//SI ES CORRECTO INSERTAMOS RESERVA
                            pool.query('INSERT INTO reserva_puerto SET cod_comp = (SELECT cod_comp FROM companies WHERE nombre = ?), ?',[nombreComp, {id_vuelo: idVuelo, puerto: port, peso: peso, precio: cost, seguro: seguro, electricidad: electr, fuel: fuel, adaptador: adapt}], (error, results) => {
                                if(error){
                                    console.log(error)
                                    response.status(404).json({error : 'reservaNoRealizada'})
                                }else{
                                    //actualizamos vuelos_carga
                                    pool.query(`UPDATE vuelos_carga SET ${portModify} = (${portModify} - 1) WHERE ?`,{id_vuelo: idVuelo}, (error, results) =>{
                                        if(error){
                                            console.log(error)
                                            response.status(404).json({error : 'vueloNoDisponibles'})
                                            //ELIMINAR RESERVA SI UPDATEPUERTO FALLA
                                        }else{
                                            response.status(200).json({error : 'noerror'})
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })

        }
        
    } catch (error) {
        console.log(error)
    }
    

}
module.exports = vuelos
