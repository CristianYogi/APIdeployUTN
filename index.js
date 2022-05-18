require("dotenv").config()
require("./data/config")
const path = require('path')

const express = require("express") //common js

const server = express()//funcion de orden superior

const port = process.env.port //el servidor corre en el puerto que me den sino en el 3000

server.use(express.static('public'))
// const usuariosRouter = require("./usuarios/routes/users")

server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'ejs');


//PERMITE INTERPRETAR LOS OBJECTOS
server.use(express.json())
server.use(express.urlencoded({extended: true})) 
    

server.get("/", (req, res) => {
    res.send("<h2>Hola Mundo</h2>") //permite entregar varias cosas, tambien variables
})


server.use("/usuarios", require("./usuarios/routes/users"))

server.use("/publicar", require("./posts/postRoute"))

// server.get("*", (req, res, next) => {
//     res.status(404).json({message: "Recurso no encontrado"})
// })

// server.delete("*", (req, res, next) => {
//     res.status(404).json({message: "Usuario no encontrado"})
// })

// server.patch("*", (req, res, next) => {
//     res.status(404).json({message: "Usuario no encontrado"})
// })

server.use((req, res, next) => {
    let error = new Error()
    error.status = 404
    error.message = "No se encuentra"
    next(error)
})

server.use((error ,req, res, next) => {
    res.status(error.status).json({status: error.status, message : error.message})
})


server.listen(port, (err) => {
    err ? console.log(`Error: ${err}`) : console.log(`App corre en http://localhost:${port}`)
})




