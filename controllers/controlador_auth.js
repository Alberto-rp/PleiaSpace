const jwt = require("jsonwebtoken")
const bcryp = require("bcryptjs")
const { promisify } = require("util")

//BBDD
var pool = require('../config/conection')

//Enviar mails
var transporter = require('../config/mailer')
require('dotenv').config();


// Método de registro
exports.registro = async (request, response) => {
    try {
        let nombre = request.body.name
        let surnames = request.body.surnames
        let email = request.body.email
        let passwd = request.body.passwd
        let country = request.body.country
        let birthDate = request.body.birthDate

        // Encriptar passwd
        let passHash = await bcryp.hash(passwd, 8)

        pool.query('INSERT INTO usuarios SET ?', { nombre: nombre, apellidos: surnames, password: passHash, email: email, pais: country, fecha_nac: birthDate }, (error, results) => {
            if (error) {
                console.log(error)
                response.redirect('/registro?error=duplicate')
            } else {
                pool.query('SELECT id_usuario FROM usuarios WHERE email = ?', [email], (error, results) => {
                    if (error) {
                        console.log(error)
                        response.redirect('/registro?error=errorDesconocido')
                    } else {
                        let id_user = results[0].id_usuario
                        let mailOpts = {
                            from: '"PleiaSpace"', // sender address
                            to: email, // list of receivers
                            subject: "Bienvenido!", // Subject line
                            html: correoBienvenida(nombre, surnames, id_user)
                        }

                        transporter.sendMail(mailOpts, (error, info) => {
                            if (error) {
                                response.redirect('/registro?error=errorDesconocido')
                            }
                            else {
                                console.log("enviado OK" + info.messageId)
                                response.redirect('/login?error=noerrorLog')
                            }
                        })
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
    }

    function correoBienvenida(nombre, surnames, id_user) {
        return `
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap" rel="stylesheet">
    
        <h1 style="background-color: #6699FF; color: white; padding:36px 48px;display:block; font-family: 'Montserrat', sans-serif;font-size:30px;font-weight:300;line-height:150%;margin:0;"><b>Bienvenido!</b></h1>
    
        <p>Estimado ${nombre + " " + surnames}, le damos la bienvenida de parte del equipo de PleiaSpace;
        </p>
    
        <p>
            Por favor, para activar su cuenta pulse <a href="${process.env.PAGE_URL}/api/activar_user?id=${id_user}">aquí</a>.
        </p>
        
        <p>Saludos.</p>`

    }
}

// Método de login
exports.login = async (request, response) => {
    try {
        let email = request.body.email
        let password = request.body.passwd

        if (!email || !password) {
            // response.redirect('/login?error=blank')
            response.status(400).json({ error: 'blankLog' })
        } else {
            pool.query("SELECT * FROM usuarios WHERE email = ?", [email], async (error, results) => {
                if (error) { console.log(error) }

                if (results.length == 0 || !(await bcryp.compare(password, results[0].password))) {
                    // response.redirect('/login?error=fail')
                    response.status(400).json({ error: 'fail' })
                } else {
                    let activado = results[0].activado
                    if (activado == 1) {
                        try {
                            // INICIO CORRECTO
                            // Creacion del token
                            const id = results[0].id_usuario
                            const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                                expiresIn: process.env.JWT_TIEMPO_EXPIRA
                            })

                            // Configuracion cookie
                            const cookiesOptions = {
                                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                                httpOnly: true
                                // la linea de arriba es para que no sea visible en el cliente
                            }

                            response.cookie('jwt', token, cookiesOptions)
                            let nombreHash = await bcryp.hash(results[0].nombre, 8)
                            response.cookie('usuario', nombreHash, { expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000), exp: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000) })

                            // response.redirect('/vuela')
                            console.log(email + " Se ha logeado")
                            response.status(200).json({ error: false }) //Se redirige desde el cliente

                        } catch (error) {
                            console.log(error)
                        }
                    } else {
                        response.status(400).json({ error: 'activationError' })
                    }
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}

exports.isAutentic = async (request, response, next) => {
    // console.log(request.cookies)
    if (request.cookies.jwt) {
        try {
            var decodificada = await promisify(jwt.verify)(request.cookies.jwt, process.env.JWT_SECRET)
            pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [decodificada.id], (error, results) => {
                if (error) { console.log(error) }
                // Si no hay resultado sigue al siguiente destino
                if (!results) { return next() }
                // request.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        response.redirect('/login?error=auth')
    }
}

exports.logout = (request, response) => {
    // response.clearCookie('jwt')
    response.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 1000),
        httpOnly: true
    });
    response.clearCookie('usuario')
    response.redirect('/')
}

exports.comprobarCookie = async (request, response) => {
    const nombreCod = request.params.name;
    if (request.cookies.jwt) {
        try {
            var decodificada = await promisify(jwt.verify)(request.cookies.jwt, process.env.JWT_SECRET)
            pool.query('SELECT nombre FROM usuarios WHERE id_usuario = ?', [decodificada.id], (error, results) => {
                if (error) { console.log(error) }
                if (results.length != 0 || await(bcryp.compare(results[0].nombre, nombreCod))) {
                    response.status(200).json({ ok: true })
                }

            })
        } catch (error) {
            console.log(error)
        }
    } else {
        response.status(200).json({ ok: false })
    }

}

exports.activarCuenta = async (request, response) => {
    let id_usuario = request.query.id
    pool.query('SELECT activado FROM `usuarios` WHERE id_usuario = ?', [id_usuario], (error, resultsOri) => {
        if (error) {
            console.log(error)
            response.redirect('/login?error=errorDesconocido')
        } else {
            if (resultsOri[0].activado == 0) { //Si no estaba activado
                pool.query('UPDATE `usuarios` SET activado = 1 WHERE id_usuario = ?', [id_usuario], (error, results) => {
                    if (error) {
                        console.log(error)
                        response.redirect('/login?error=errorDesconocido')
                    } else {
                        response.redirect('/login?error=activationSucess')
                    }

                })

            } else {
                response.redirect('/login?error=oldActivation')
            }
        }
    })
}

exports.eliminarCuenta = (request, response) => {
    try {
        let idUsuario = request.body.UsuarioElimina
        pool.query('SELECT * FROM reserva_asiento WHERE ?', [{ id_usuario: idUsuario }], (error, results) => {
            if (error) { console.log(error) }
            if (results.length == 0) {
                pool.query('DELETE FROM usuarios WHERE ?', [{ id_usuario: idUsuario }], (error, results2) => {
                    if (error) { console.log(error) }
                    else {
                        response.cookie('jwt', 'logout', {
                            expires: new Date(Date.now() + 1000),
                            httpOnly: true
                        });
                        response.clearCookie('usuario')
                        response.redirect('/')
                    }
                })
                console.log(idUsuario + " Eliminado")
            } else {
                response.redirect('/perfil?error=reservaActiva')
            }
        })
    } catch (error) {
        console.log(error)
    }
}