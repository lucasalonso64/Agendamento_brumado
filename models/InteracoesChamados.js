const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose);



const InteracoesChamados = new Schema({

    textointeracao: {
        type: String,
        required: true
    },

    numerochamado: {
        type: Number

    },

    tipotramite: {
        type: String

    },

    numerointeracao: {
        seq: { type: Number, default: 0 }
    },
    
    created: {
        type: Date,
        default: Date.now()
    }

}, {
        timestamps: { created: true, updatedAt: false }
    })

    InteracoesChamados.plugin(AutoIncrement, { inc_field: 'numerointeracao' });

mongoose.model("interacoeschamados", InteracoesChamados)