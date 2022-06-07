
var pool = require('../config/conection')

exports.subirCurriculum = async (request, response) => {
    console.log(request.body)
    console.log(request.file)
    pool.query('INSERT INTO aspirantes SET ?',{nombre: request.body.nombre, apellidos: request.body.apellidos, email: request.body.email, telefono: request.body.phone, ciudad: request.body.ciudad, ruta_curriculum: request.file.path},(error, results) => {
        if(error){
            console.log(error)
            response.status(404).json({error : 'errorDesconocido'})
        }
        else{
            response.status(200).json({error : 'noerrorWWU'})
        }
    })
}