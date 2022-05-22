var mysql = require('mysql');

// Añadimos esta línea para que las variables de entorno sean alcanzables
require('dotenv').config();

var pool = mysql.createPool({
    connectionLimit : 10,
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWD,
    database : process.env.DB_DATABASE,
});     

module.exports = pool;