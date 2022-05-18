const { getAllUsersDB, findOneUser, uploadUser, deleteUsuario, patchUserById, findUserByEmail} = require("../model/usersModel")
const comprobarNaN = require("../../utils/notNumber")
const {hashPassword, checkPassword} = require("../../utils/passworHandler")
const { tokenSing, tokenVerify } = require("../../utils/jwtHandler")
const { matchedData } = require("express-validator")
const nodemailer = require("nodemailer")
const url = process.env.url_base

//NODEMAILER CON MAILTRAP
const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.mail_user,
      pass: process.env.mail_pass
    }
  });

const getAllUsers = async (req, res, next) => {
    const dbresponse = await getAllUsersDB()

    dbresponse instanceof Error ? next(dbresponse) : res.status(200).json(dbresponse)

}


const findUser = async (req, res, next) => {

    if(comprobarNaN(req.params.id, res)) return

    const dbresponse = await findOneUser(+req.params.id) // el mas sirve para cambiar a INT

    if(!Object.keys(dbresponse).length){
        next()
    }else{
        dbresponse instanceof Error ? next(dbresponse) : res.status(200).json(dbresponse)
    }
    
}

const  postUser = async (req, res, next) => {

    const cleanBody = matchedData(req) // Devuelve un objeto con los campos que express-validator haya validado o sanitizado

    let image = ""
    if(req.hasOwnProperty('file')){image = url + req.file.filename}

    
    
    const password = await hashPassword(cleanBody.password)

    const dbresponse = await uploadUser({...cleanBody, password, image})
    
    if (dbresponse instanceof Error) return next(dbresponse)

    const user = {
        name : cleanBody.name,
        email: cleanBody.email
    }
    const tokenData = {
        token: await tokenSing(user, '2h'),
        user
    }
    res.status(200).json({message : 'Usuario Registrado', Token_Info: tokenData})

}

const deleteUser = async (req, res, next) =>{

    if(comprobarNaN(req.params.id, res)) return

    const dbresponse = await deleteUsuario(req.params.id)
    
    if(dbresponse.affectedRows === 0){
        return next()
    }

    dbresponse instanceof Error ? next(dbresponse) : res.status(200).json("Usuario eliminado")
    

    // usuario.length <= 0 ? next() : res.status(200).json(usuario)

}

const updateUser = async (req, res, next) => {
    if(comprobarNaN(req.params.id, res)) return

    const dbresponse = await patchUserById(req.params.id, req.body)

    if(!dbresponse.affectedRows){
        return next()
    }

    dbresponse instanceof Error ? next(dbresponse) : res.status(200).json("Usuario actualizado")
    
}

const login = async (req, res, next) =>{
    
    const cleanBody = matchedData(req)
    const dbresponse = await findUserByEmail(cleanBody.email)
    
    if(!Object.keys(dbresponse).length){
        next()
    }else{
        
        if (dbresponse instanceof Error){
            res.status(500).json(dbresponse)
            return
        }
        
        if(await checkPassword(cleanBody.password, dbresponse[0].password)){

            const user = {
                id: dbresponse[0].id,
                name: dbresponse[0].name,
                email: dbresponse[0].email
            }

            const tokenData = {
                toke: await tokenSing(user, '2h'),
                user
            }

            res.status(200).json({message: `Te logeaste como ${user.name}.`, Token_Info: tokenData})

        }else{
            let error = new Error("Contraseña incorrecta")
            error.status = 401
            next(error)
        }
        
    }


}


//Forgot Password

const forgot = async(req, res, next) =>{

    
    const dbresponse = await findUserByEmail(req.body.email)

    if(!Object.keys(dbresponse).length) return next() 

    const user = {
        id: dbresponse[0].id,
        name: dbresponse[0].name,
        email: dbresponse[0].email
    }

    const token = await tokenSing(user, '15m')
    const link = `${process.env.url_base}usuarios/reset/${token}` 

    const emailDetails = {
        from: "soporte@mydomain.com",
        to: user.email,
        subject: "Password Recovery",
        html: `
        <h2>Password Recovery Service</h2>
        <p>Para resetar la pass clickeate este link perron</p>
        <a href="${link}">-----ALto link-----</a>
        `
    }  

    transport.sendMail(emailDetails, (err, data) => {
        if(err){
            err.message = "Internal Server Error"
            return next(err)
        }

        res.status(200).json({message: `Ey ${user.name} se te envio el email a ${user.email}, miralo. Tenes 15 minutasos antes de que cages.`})
    })

}


const reset = async(req, res, next) =>{

    const {token} = req.params
    const tokenStatus = await tokenVerify(token) //Estan los datos del usuario

    if(tokenStatus instanceof Error){
        res.status(403).json({message: "Invalid Token"})
    }else{
        res.render('form.ejs', {datos: {token}})
    }

    

}

const newPass = async(req, res, next) =>{

    const { token } = req.params
    const tokenStatus = await tokenVerify(token) 

    if(tokenStatus instanceof Error) return next(tokenStatus)

    const newPassword =  await hashPassword(req.body.password_1)


    const dbresponse = await patchUserById(tokenStatus.id, {password : newPassword})

    dbresponse instanceof Error ? next(dbresponse) : res.status(200).json({message: "La contraseña fue cambiada"})

}


module.exports = {getAllUsers, findUser, postUser, deleteUser, updateUser, login, forgot, newPass, reset}