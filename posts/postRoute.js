const router = require("express").Router()
const {addOne, listAll} = require("./postController")
const isAuth = require("../middlewares/isAuth")

router.get("/", listAll)

router.post("/", isAuth, addOne)


module.exports = router