var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host     : 'eu-cdbr-west-02.cleardb.net',
    user     : 'bb93f3ee1f045e',
    password : '86aa4083',
    database : 'heroku_1787a299a65ece9',
});    
module.exports = pool;


// Pool LOCAL
// var pool = mysql.createPool({
//     connectionLimit : 10,
//     host     : 'localhost',
//     user     : 'root',
//     password : '',
//     database : 'pleiaspace',
// });   

// POOL HEROKU
// var pool = mysql.createPool({
//     connectionLimit : 10,
//     host     : 'eu-cdbr-west-02.cleardb.net',
//     user     : 'bb93f3ee1f045e',
//     password : '86aa4083',
//     database : 'heroku_1787a299a65ece9',
// });    