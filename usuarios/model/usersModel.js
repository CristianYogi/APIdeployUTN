//NO HACEN FALTA LOS AWAIT ACA
const pool = require("../../data/config")

const getAllUsersDB = async() => {
 const query = "SELECT * FROM users"

 try {
    return await pool.query(query)    
 } catch (error) {
     error.status = 500
     error.message = error.code
     return error
 }

}

const findOneUser = async(id) => {
    const query = `SELECT * FROM users WHERE users.id = ${id} LIMIT 1`

    try {
        return await pool.query(query)    
     } catch (error) {
        error.status = 500
        error.message = error.code
        return error
     }
     
}

const uploadUser = async(usuario) =>{

    // const query = `INSERT INTO users (name, userName, email) VALUES('${usuario.name}', '${usuario.username}', '${usuario.email}')`
    const query = `INSERT INTO users SET ?`

    try {
        return await pool.query(query, usuario)    
     } catch (error) {
        console.log(error)
        error.status = 500
        error.message = error.code
        return error
     }


}

const deleteUsuario = async (userID) => {
    const query = `DELETE FROM users WHERE id = ${userID}`

    try {
        return await pool.query(query)    
     } catch (error) {
        console.log(error)
        error.status = 500
        error.message = error.code
        return error
     }
     
}

const patchUserById = async (id, user) =>{
    const query = `UPDATE users SET ? WHERE id = ${id}`

    try {
        return await pool.query(query, user)    
     } catch (error) {
        console.log(error)
        error.status = 500
        error.message = error.code
        return error
     }

}

const findUserByEmail = async (email) =>{
    const query = `SELECT * FROM users WHERE email = '${email}'`
    try {
        return await pool.query(query)
    } catch (error) {
        error.status = 500
        error.message = error.code
        return error
    }

}

module.exports = {getAllUsersDB, findOneUser, uploadUser, deleteUsuario, patchUserById, findUserByEmail}