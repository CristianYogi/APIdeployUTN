const router = require("express").Router()
const fileUpload = require("../../utils/handlestorage")
const { validatorCreateUser, validatorResetearPass, validatorLoginUser } = require("../../validator/users")
// const userController = require("../controller/users")
const {getAllUsers, findUser, forgot, reset, newPass, postUser, deleteUser, updateUser, login} = require("../controller/users")



// console.log(usuarios)

//TODOS LOS USUARIOS
router.get("/", getAllUsers)

//USUARIOS ESPECIFICOS
router.get("/:id", findUser)

router.post("/", fileUpload.single("file"), validatorLoginUser, validatorCreateUser, postUser)

router.post("/login",validatorLoginUser , login)

router.delete("/:id", deleteUser)

router.patch("/:id", updateUser)

//RESETEAR CONTRASEÑA
router.post("/forgot-password", forgot)

router.get("/reset/:token", reset)

router.post("/reset/:token", validatorResetearPass, newPass)

module.exports = router