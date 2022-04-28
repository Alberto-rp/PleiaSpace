var express = require("express");
var bodyParser  = require("body-parser");
var vuelos = require('./routes/rutasVuelos')

var router = express.Router();
var app = express();

var PORT = 3008
//3008
//En el futuro modificar guay ejs


app.use("/", express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(router)
app.use(vuelos)


// Iniciamos el servidor
// app.listen(PORT, () => {
//     console.log(`Server iniciado en el puerto ${PORT}`)
// })

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server iniciado en el puerto ${PORT}`)
})