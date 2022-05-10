
var pool = require('../DataBase/conection')

exports.subirCurriculum = async (request, response) => {
    response.status(200).json({error : false})
}

// exports.obtenerUsuario = async (request, response) => {
//     var decodificada = await promisify(jwt.verify)(request.cookies.jwt, process.env.JWT_SECRET)
//     let query = 'SELECT * FROM `usuarios` WHERE id_usuario = ?;'
//     pool.query(query, [decodificada.id], (error, results) => {
//         if(error){console.log(error)}
//         response.status(200).json(results)
//     })
// }