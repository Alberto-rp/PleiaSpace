const jwt = require("jsonwebtoken")
const bcryp = require("bcryptjs")
const {promisify} = require("util")
var pool = require('../DataBase/conection')

// Proceso de registro

exports.registro = async (request, response) =>{
    try {
        let nombre = request.body.name
        let surnames = request.body.surnames
        let email = request.body.email
        let passwd = request.body.passwd
        let country = request.body.country
        let birthDate = request.body.birthDate
        console.log(nombre+" "+surnames+" "+email+" "+country+" "+passwd+" "+birthDate)
    
        // Encriptar passwd
        let passHash = await bcryp.hash(passwd, 8)
        console.log(passHash)

        pool.query('INSERT INTO usuarios SET ?', {nombre: nombre, apellidos: surnames, password: passHash, email: email}, (error, results) =>{
            if(error){console.log(error)}
            response.redirect('/login')
        })
    } catch (error) {
        console.log(error)
    }
}
