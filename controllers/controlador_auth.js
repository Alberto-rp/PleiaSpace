const jwt = require("jsonwebtoken")
const bcryp = require("bcryptjs")
const {promisify} = require("util")
var pool = require('../DataBase/conection')

// Método de registro
exports.registro = async (request, response) =>{
    try {
        let nombre = request.body.name
        let surnames = request.body.surnames
        let email = request.body.email
        let passwd = request.body.passwd
        let country = request.body.country
        let birthDate = request.body.birthDate

        // Encriptar passwd
        let passHash = await bcryp.hash(passwd, 8)

        pool.query('INSERT INTO usuarios SET ?', {nombre: nombre, apellidos: surnames, password: passHash, email: email, pais: country, fecha_nac: birthDate}, (error, results) =>{
            if(error){console.log(error)}
            response.redirect('/login')
        })
    } catch (error) {
        console.log(error)
    }
}

// Método de login
exports.login = async (request, response) =>{
    try {
        let email = request.body.email
        let password = request.body.passwd

        if(!email || !password){
            response.redirect('/login?error=blank')
        }else{
            pool.query("SELECT * FROM usuarios WHERE email = ?", [email], async (error, results)=>{
                if(error){console.log(error)}

                if(results.length == 0 || ! (await bcryp.compare(password, results[0].password))){
                    response.redirect('/login?error=fail')
                }else{
                    // Inicio OK
                    const id = results[0].id_usuario
                    // const token = jwt.sign({id:id})
                    console.log(id)
                    // Necesitamos variables de entorno para seguir
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}
