const searchById = (id, usuariosArray) => {

    return usuariosArray.find((usuario) => usuario.id === id)

}

module.exports = {
    searchById
}
