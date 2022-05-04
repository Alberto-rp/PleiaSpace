
var pool = require('../DataBase/conection')
const jwt = require("jsonwebtoken")
const bcryp = require("bcryptjs")
const {promisify} = require("util")
const { response } = require('express')

exports.obtenerUsuario = async (request, response) => {
    var decodificada = await promisify(jwt.verify)(request.cookies.jwt, process.env.JWT_SECRET)
    let query = 'SELECT * FROM `usuarios` WHERE id_usuario = ?;'
    pool.query(query, [decodificada.id], (error, results) => {
        if(error){console.log(error)}
        response.status(200).json(results)
    })
}

exports.reservarVuelo = async (request, response) => {
    try {
        let idUsuario = request.body.idUsuario
        let idVuelo = request.body.idVueloSel
        let email = request.body.email
        let phone = request.body.phone
        let country = request.body.country
        let prov = request.body.stateProv
        let ciudad = request.body.city
        let codPost = request.body.codPost
        let direccion = request.body.adress
        let metodoPago = request.body.payMeth
        let numAsients = request.body.numAsients
        let motiv = request.body.info

        pool.query('INSERT INTO reserva_asiento SET ?', {id_usuario: idUsuario, id_vuelo: idVuelo, asientos_reservados: numAsients, metodo_pago: metodoPago, motivacion: motiv}, (error, results) =>{
            if(error){
                console.log(error)
            }else{
                pool.query('UPDATE vuelos_comerciales vc SET asientos_disponibles = asientos_disponibles - (SELECT asientos_reservados FROM reserva_asiento WHERE id_vuelo = vc.id_vuelo) WHERE id_vuelo = ?', [idVuelo],(error, results) =>{
                    if(error){
                        console.log(error)
                    }else{
                        pool.query('UPDATE usuarios SET ? WHERE id_usuario = ?', [{email: email, pais: country, telefono: phone, provincia: prov, ciudad: ciudad, cod_postal: codPost, direccion: direccion}, idUsuario],(error, results) =>{
                            if(error){
                                console.log(error)
                            }
                        })
                    }
                })
            }
        })
        

        response.redirect('/vuela')

    } catch (error) {
        console.log(error)
    }
}