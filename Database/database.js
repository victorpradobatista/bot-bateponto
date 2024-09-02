const mysql = require("mysql");
const config = require('../config.json')
function connect(){
    
    return mysql.createPool({
        host: `${config.ip}`, // IP da database. Se estiver em localhost deixe 127.0.0.1.
        user: `${config.user}`, // Usuario da database, padrao root.
        password: `${config.password}`, // Senha da database, padrao sem senha.
        database: `${config.databasename}` // Nome da database.
    });
}

const databaseC = connect()