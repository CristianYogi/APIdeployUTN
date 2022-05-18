const comprobarNaN = (numero, res) => {

    if(isNaN(+numero)){
        res.status(400).json({message: "El ID debe de ser un numero entero positivo."})
        return true
    }else{
        return false
    }

}

module.exports = comprobarNaN