var express = require("express");
var bodyParser  = require("body-parser");
var cookieParser = require("cookie-parser")
var vuelos = require('./routes/rutasEstaticos')
var rutasAPI = require("./routes/rutasAPI")

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
// app.use(cookieParser)


// Iniciamos el servidor
// app.listen(PORT, () => {
//     console.log(`Server iniciado en el puerto ${PORT}`)
// })

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server iniciado en el puerto ${PORT}`)
})