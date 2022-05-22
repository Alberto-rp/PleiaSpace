
var pool = require('../config/conection')
var transporter = require('../config/mailer')
require('dotenv').config();

var vuelos = {}

vuelos.getVuelos = function (request, response) {
    pool.query('SELECT id_vuelo, fecha, tipo_vuelo, orbita_destino, lanzador FROM `vuelos` ORDER BY fecha', (error, results) => {
        if (error) { console.log(error) }
        response.status(200).json(results)
    })
}

vuelos.getvuelosUsuario = function (request, response) {
    const idUser = request.params.id;
    let query = 'SELECT v.id_vuelo, orbita_destino, fecha, asientos_reservados, metodo_pago, vc.precio_asiento FROM vuelos v, reserva_asiento ra, vuelos_comerciales vc WHERE v.id_vuelo = ra.id_vuelo AND v.id_vuelo = vc.id_vuelo AND ra.id_usuario = ?'
    pool.query(query, [idUser], (error, results) => {
        if (error) { console.log(error) }
        response.status(200).json(results)
    })
}

vuelos.getVuelosCOMByFecha = function (request, response) {
    const fechaP = request.params.fechita;
    let fecha = new Date(fechaP)

    let query = 'SELECT vuelos.id_vuelo, fecha, tipo_vuelo, orbita_destino, asientos_disponibles, precio_asiento FROM `vuelos`, `vuelos_comerciales` WHERE fecha > ? AND tipo_vuelo = "COM" AND vuelos.id_vuelo = vuelos_comerciales.id_vuelo  ORDER BY fecha;'
    pool.query(query, [fecha], (error, results) => {
        if (error) { console.log(error) }
        response.status(200).json(results)
    })

}

vuelos.getVuelosCarga = function (request, response) {
    const orb = request.body.orbita
    const fecha = new Date(request.body.fecha)

    let query = 'SELECT v.id_vuelo, fecha, orbita_destino, lanzador, precio_kg, disp_port_A, disp_port_B FROM `vuelos` v, `vuelos_carga` vc WHERE fecha > ? AND tipo_vuelo = "CAR" AND orbita_destino = ? AND v.id_vuelo = vc.id_vuelo  ORDER BY fecha;'
    pool.query(query, [fecha, orb], (error, results) => {
        if (error) { console.log(error) }
        response.status(200).json(results)
    })

}

vuelos.cancelarVueloCarga = (request, response) => {
    let id_reserva = request.query.id
    let id_vueloVar
    let puerto

    //Sacamos los datos de la reserva antes de eliminarlos
    pool.query('SELECT * FROM reserva_puerto WHERE ?', { id_reserva: id_reserva }, (error, results) => {
        if (error) {
            console.log(error)
            response.status(400).redirect('/carga?error=errorDesconocido')
        }
        else if(results.length > 0){
            //Sacamos las variables necesarias
            id_vueloVar = results[0].id_vuelo
            puerto = results[0].puerto

            let portModify
            if (puerto == 'A') {
                portModify = 'disp_port_A'
            } else if (puerto == 'B') {
                portModify = 'disp_port_B'
            }
            //Eliminamos la reserva
            pool.query('DELETE FROM reserva_puerto WHERE ?', { id_reserva: id_reserva }, (error, results2) => {
                if (error) {
                    console.log(error)
                    response.status(400).redirect('/carga?error=errorDesconocido')
                } else {
                    // Añadimos el puerto de nuevo a su lugar
                    pool.query(`UPDATE vuelos_carga SET ${portModify} = (${portModify} + 1) WHERE ?`, { id_vuelo: id_vueloVar }, (error, results) => {
                        if (error) {
                            console.log(error)
                            response.status(400).redirect('/carga?error=errorDesconocido')
                        } else {
                            response.status(200).redirect('/carga?error=reservElim')
                        }
                    })
                }
            })

        }else{
            response.status(400).redirect('/carga?error=errorReservaEliminada')
        }
    })
}

vuelos.reservarVueloCarga = (request, response) => {
    console.log(request.body)

    try {
        // Datos reserva
        let idVuelo = request.body.id
        let peso = request.body.peso
        let cost = request.body.coste
        let port = request.body.puerto

        // Variable auxiliar para realizar la ultima query
        let portModify
        if (port == 'A') {
            portModify = 'disp_port_A'
        } else if (port == 'B') {
            portModify = 'disp_port_B'
        }


        // Datos addons
        let seguro = 0
        let electr = 0
        let adapt = 0
        let fuel = 0
        if (request.body.addonsSEL != undefined) {
            for (item of request.body.addonsSEL) {
                switch (item) {
                    case 'seguro':
                        seguro = 1
                        break
                    case 'elect':
                        electr = 1
                        break
                    case 'adapt':
                        adapt = 1
                        break
                    case 'fuel':
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
        let codPostComp = request.body.datosComp[4]
        let countryComp = request.body.datosComp[5]

        // Datos contacto
        let nombreContact = request.body.datosComp[6]
        let emailContact = request.body.datosComp[7]
        let telContact = request.body.datosComp[8]

        // Existe en BD
        let existeEnBD = request.body.datosComp[9]

        if (existeEnBD) {
            let idComp = request.body.datosComp[10]

            pool.query('INSERT INTO reserva_puerto SET cod_comp = ?, ?', [idComp, { id_vuelo: idVuelo, puerto: port, peso: peso, precio: cost, seguro: seguro, electricidad: electr, fuel: fuel, adaptador: adapt }], (error, results) => {
                if (error) {
                    console.log(error)
                    response.status(400).json({ error: 'errorDesconocido' })
                } else {
                    //actualizamos vuelos_carga
                    pool.query(`UPDATE vuelos_carga SET ${portModify} = (${portModify} - 1) WHERE ?`, { id_vuelo: idVuelo }, (error, results) => {
                        if (error) {
                            console.log(error)
                            response.status(400).json({ error: 'errorDesconocido' })
                            //ELIMINAR RESERVA SI UPDATEPUERTO FALLA
                        } else {
                            let id_reserva_vuelo
                            pool.query(`SELECT id_reserva FROM reserva_puerto WHERE ? AND cod_comp = (SELECT cod_comp FROM companies WHERE nombre = ?)`, [{ id_vuelo: idVuelo }, nombreComp], (error, results) => {
                                id_reserva_vuelo = results[0].id_reserva
                                let mailOpts = {
                                    from: '"PleiaSpace"', // sender address
                                    to: emailContact, // list of receivers
                                    subject: "Reserva Puerto", // Subject line
                                    html: datosCorreo(idVuelo, nombreComp, port, peso, cost, nombreContact, emailContact, telContact, id_reserva_vuelo)
                                }

                                transporter.sendMail(mailOpts, (error, info) => {
                                    if (error) {
                                        response.status(500).json({ error: error.message })
                                    }
                                    else {
                                        console.log("enviado OK" + info.messageId)
                                        response.status(200).json({ error: 'noerror' })
                                    }
                                })
                            })
                        }
                    })
                }
            })
        } else {

            //INSERTAMOS COMPAÑIA
            pool.query('INSERT INTO companies SET ?', { nombre: nombreComp, direccion: adressComp, ciudad: cityComp, provincia: provComp, codigo_postal: codPostComp, pais: countryComp }, (error, results) => {
                if (error) {
                    console.log(error)
                    response.status(400).json({ error: 'nombreComp' })
                } else {//SI ES CORRECTO INSERTAMOS CONTACTO
                    pool.query('INSERT INTO contactos_comp SET cod_comp = (SELECT cod_comp FROM companies WHERE nombre = ?), ?', [nombreComp, { nombre: nombreContact, email: emailContact, telefono: telContact }], (error, results) => {
                        if (error) {
                            console.log(error)
                            // ELIMINAR COMPAÑIA SI CONTACTO FALLA
                            pool.query('DELETE FROM companies WHERE ?', [{ nombre: nombreComp }], (error, results2) => {
                                if (error) {
                                    console.log(error)
                                    response.status(404).json({ error: 'errorDesconocido' })
                                } else {
                                    response.status(404).json({ error: 'contactoDuplicado' })
                                }
                            })
                        } else {//SI ES CORRECTO INSERTAMOS RESERVA
                            pool.query('INSERT INTO reserva_puerto SET cod_comp = (SELECT cod_comp FROM companies WHERE nombre = ?), ?', [nombreComp, { id_vuelo: idVuelo, puerto: port, peso: peso, precio: cost, seguro: seguro, electricidad: electr, fuel: fuel, adaptador: adapt }], (error, results) => {
                                if (error) {
                                    console.log(error)
                                    response.status(404).json({ error: 'errorDesconocido' })
                                } else {
                                    //actualizamos vuelos_carga
                                    pool.query(`UPDATE vuelos_carga SET ${portModify} = (${portModify} - 1) WHERE ?`, { id_vuelo: idVuelo }, (error, results) => {
                                        if (error) {
                                            console.log(error)
                                            //ELIMINAR RESERVA SI UPDATEPUERTO FALLA
                                            pool.query(`DELETE FROM reserva_puerto WHERE ? AND cod_comp = (SELECT cod_comp FROM companies WHERE nombre = ?)`, [{ id_vuelo: idVuelo }, nombreComp], (error, results) => {
                                                if (error) { console.log(error) }
                                            })
                                            response.status(404).json({ error: 'vueloNoDisponibles' })
                                        } else {

                                            //Si todo ha salido bien, recuperamos el ID de reserva:
                                            let id_reserva_vuelo
                                            pool.query(`SELECT id_reserva FROM reserva_puerto WHERE ? AND cod_comp = (SELECT cod_comp FROM companies WHERE nombre = ?)`, [{ id_vuelo: idVuelo }, nombreComp], (error, results) => {
                                                id_reserva_vuelo = results[0].id_reserva
                                                let mailOpts = {
                                                    from: '"PleiaSpace"', // sender address
                                                    to: emailContact, // list of receivers
                                                    subject: "Reserva Puerto", // Subject line
                                                    html: datosCorreo(idVuelo, nombreComp, port, peso, cost, nombreContact, emailContact, telContact, id_reserva_vuelo)
                                                }

                                                transporter.sendMail(mailOpts, (error, info) => {
                                                    if (error) {
                                                        response.status(500).json({ error: error.message })
                                                    }
                                                    else {
                                                        console.log("enviado OK" + info.messageId)
                                                        response.status(200).json({ error: 'noerror' })
                                                    }
                                                })
                                            })
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

    function datosCorreo(idVuelo, nombreComp, port, peso, cost, nombreContact, emailContact, telContact, id_reserva_vuelo) {
        return `
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" rel="stylesheet">
    
        <h1 style="background-color: #6699FF; color: white; padding:36px 48px;display:block; font-family: 'Montserrat', sans-serif;font-size:30px;font-weight:300;line-height:150%;margin:0;"><b>Reserva de vuelo confirmada</b></h1>
    
        <p>Estimado ${nombreContact}, nos complace comunicarle que su reserva se ha efectuado correctamente.<br>
            Los datos de su reserva son los siguientes:
        </p>
    
        <h2 style="color: #6699FF; font-family: 'Montserrat', sans-serif;">Reserva ${id_reserva_vuelo}</h2>
        <table style="border:1px solid #a7a7a7; text-align: center;">
        <tr>
            <th style="border:1px solid #a7a7a7; width: 130px;">Compañia</th>
            <th style="border:1px solid #a7a7a7; width: 130px;">Vuelo</th>
            <th style="border:1px solid #a7a7a7; width: 130px;">Puerto Seleccionado</th>
            <th style="border:1px solid #a7a7a7; width: 130px;">Masa de la carga</th>
            <th style="border:1px solid #a7a7a7; width: 130px;">Precio total</th>
            </tr>
            <tr>
                <td style="border:1px solid #a7a7a7;">${nombreComp}</td>
                <td style="border:1px solid #a7a7a7;">${idVuelo}</td>
                <td style="border:1px solid #a7a7a7;">${port}</td>
                <td style="border:1px solid #a7a7a7;">${peso}</td>
                <td style="border:1px solid #a7a7a7;">${Number(cost).toLocaleString("es-ES", { style: 'currency', currency: 'EUR' })}</td>
            </tr>
        </table>
    
        <p>
            Si alguno de los datos que aquí aparecen no fueran correctos, o deseara cambiar algo en la reserva, pongase en contacto con nosotros respondiendo a este correo.<br>
            Si desea <b>cancelar</b> su reserva pinche <a href="${process.env.PAGE_URL}/api/cancelar?id=${id_reserva_vuelo}">aquí</a>
        </p>
        
        <h2 style="color: #6699FF; font-family: 'Montserrat', sans-serif;">Datos de contacto</h2>
        <ul>
            <li><b>Compañia:</b> ${nombreComp}</li>
            <li><b>Nombre:</b> ${nombreContact}</li>
            <li><b>Correo electronico:</b> ${emailContact}</li>
            <li><b>Telefono:</b> ${telContact}</li>
        </ul>
        <p>
            Nos pondremos en contacto para concretar más detalles cuando se acerque la fecha del vuelo.
        </p>
        <p>
            Saludos de parte del equipo de PleiaSpace!
        </p>`
    }


}
module.exports = vuelos
