var express = require("express");
var bodyParser  = require("body-parser");
var cookieParser = require("cookie-parser")
var vuelos = require('./routes/rutasEstaticos')
var rutasAPI = require("./routes/rutasAPI")
const dotenv = require('dotenv')
<<<<<<< HEAD
// const multer = require('multer') dd


=======
>>>>>>> develop

dotenv.config()

var router = express.Router()
var app = express()
var PORT = 3008


// Archivos estáticos
app.use("/", express.static('public'))

// Envio de datos al servidor
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Rutas
app.use(router)
app.use(vuelos)
app.use(rutasAPI)

// Funcion de las cookies
app.use(cookieParser())


// Iniciamos el servidor 
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server iniciado en el puerto ${PORT}`)
})