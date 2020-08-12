const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose);

const StatusChamado = new Schema({
    codigo: {
      seq: {type: Number, default: 0}
    },
    descricao: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now()
    },
})

StatusChamado.plugin(AutoIncrement, {inc_field: 'codigo'});

mongoose.model("statuschamado", StatusChamado)