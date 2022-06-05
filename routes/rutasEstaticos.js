var express = require('express');
const url = require('url')
const path = require('path')
var router = express.Router();
const cookieParser = require("cookie-parser")
router.use(cookieParser())
const authController = require('../controllers/controlador_auth')

//Importamos el modelo que ejecutará las sentencias SQL


// router.get('/vuelosCOM', function(request, response){
//     const ObjetoParametros = url.parse(request.url, true).query;
//     response.redirect("reserva_asiento.html?fechaIn="+encodeURI(ObjetoParametros.fechaIn))
//     // let fecha = new Date(ObjetoParametros.fechaIn)

//     // vuelosControler.getVuelosCOMByFecha(fecha, function(error, data){
//         // response.status(200).json(data)
//     // })
// })

router.get('/calendario', function(request, response){
    response.sendFile(path.join(__dirname + '/../public/calendario.html'));
})

router.get('/copyright', function(request, response){
    response.sendFile(path.join(__dirname + '/../public/copyright.html'));
})

router.get('/avisoCookies', function(request, response){
    response.sendFile(path.join(__dirname + '/../public/avisoCookies.html'));
})

router.get('/vuela', authController.isAutentic, function(request, response){
    response.sendFile(path.join(__dirname + '/../public/vuelo_comercial.html'));
})

router.get('/login', function(request, response){
    //Si la sesion no esta iniciada te lleva a login; sino te redirije a perfil
    if(!request.cookies.jwt){
        response.sendFile(path.join(__dirname + '/../public/login.html'))
    }else{
        response.redirect("/perfil")
    }
})

router.get('/registro', function(request, response){
    if(!request.cookies.jwt){
        response.sendFile(path.join(__dirname + '/../public/registro.html'))
    }else{
        response.redirect("/perfil")
    }
})

router.get('/perfil', authController.isAutentic, function(request, response){
    response.sendFile(path.join(__dirname + '/../public/perfil.html'))
    // response.redirect('/registro')
})

router.get('/empleo', function(request, response){
    response.sendFile(path.join(__dirname + '/../public/workWithUs.html'))
    // response.redirect('/registro')
})

router.get('/carga', function(request, response){
    response.sendFile(path.join(__dirname + '/../public/vuelo_carga.html'))
    // response.redirect('/registro')
})

router.get('/historia', function(request, response){
    response.sendFile(path.join(__dirname + '/../public/history.html'))
    // response.redirect('/registro')
})

router.get('/vehiculos_electra', function(request, response){
    response.sendFile(path.join(__dirname + '/../public/veh_electra.html'))
    // response.redirect('/registro')
})

router.get('/vehiculos_atlas', function(request, response){
    response.sendFile(path.join(__dirname + '/../public/veh_atlas.html'))
    // response.redirect('/registro')
})

router.get('/vehiculos', function(request, response){
    response.sendFile(path.join(__dirname + '/../public/vehiculos.html'))
    // response.redirect('/registro')
})
module.exports = router