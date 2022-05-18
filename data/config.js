const mysql = require("mysql2")
const util = require("util")
// const util = require("util")
//pool de conexiones
const pool = mysql.createPool({
    host: process.env.db_host,
    database: process.env.db_name,
    user : process.env.db_user,
    
})


pool.getConnection((err) => {
    err ? console.warn("No conectado", {error : err}) : console.log("Conexion establecida con la base de datos.")
})

pool.query = util.promisify(pool.query)

module.exports = pool