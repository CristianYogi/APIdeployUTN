const { getAllPost, addNewPost, getPostWith } = require("./postModel")


const listAll = async (req, res, next) => {
    let dbresponse = null
    if(req.query.title){
        dbresponse = await getPostWith(req.query.title)
    } else{
        dbresponse = await getAllPost()
    }
    
    if(!Object.keys(dbresponse).length){
        next()
    }else{
        dbresponse instanceof Error ? next(dbresponse) : res.status(200).json(dbresponse)
    }

}

const addOne = async (req, res, next) =>{

    const dbresponse = await addNewPost({userid: req.token.id, ...req.body})
    dbresponse instanceof Error ? next(dbresponse) : res.status(201).json({message: `Post Created Succesfuly`})

}

module.exports = {listAll, addOne}