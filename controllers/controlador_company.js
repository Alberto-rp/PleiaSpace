var pool = require('../config/conection')

exports.getCompany = (request, response) => {
    let nombreComp = request.params.name

    if (nombreComp.length >= 2) {
        nombreComp += '%'
        pool.query('SELECT cod_comp, nombre, ciudad, pais FROM `companies` WHERE nombre LIKE ? ORDER BY nombre', [nombreComp], (error, results) => {
            if (error) {
                console.log(error)
                response.status(204).json({ busc: 'error' })
            }

            response.status(200).json(results)
        })
    } else {
        response.status(200).json({ 0: [] })
    }
}

exports.getDataCompany = (request, response) => {
    let idComp = request.body.id
    let correoContact = request.body.correo

    let salida = {}

    if (idComp != -1) {
        pool.query('SELECT * FROM `companies` WHERE cod_comp = ?', [idComp], (error, results) => {
            if (error) {
                console.log(error)
                response.status(404).json({ error: 'selectOptionModal' })
            } else {
                salida.datosCompany = results
                pool.query('SELECT email, nombre, telefono FROM `contactos_comp`  WHERE cod_comp = ? AND email = ?', [idComp, correoContact], (error, results2) => {
                    if (error) {
                        console.log(error)
                        response.status(404).json({ error: 'selectOptionModal' })
                    } else {
                        if (results2.length > 0) { //Si el correo y la compañia son correctos
                            salida.datosContact = results2
                            response.status(200).json(salida)
                        } else {
                            response.status(404).json({ error: 'wrongMail' })
                        }

                    }
                })

            }
        })
    } else {
        response.status(404).json({ error: 'selectOptionModal' })
    }
}