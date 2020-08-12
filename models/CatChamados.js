const mongoose = require('mongoose')
//const mongoosePaginate = require('mongoose-paginate-v2')
const Schema = mongoose.Schema

const CatChamados = new Schema({
    nome: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
})

//CatChamados.plugin(mongoosePaginate)

mongoose.model("catchamados", CatChamados)