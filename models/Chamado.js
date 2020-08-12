const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AutoIncrement = require('mongoose-sequence')(mongoose);



const Chamado = new Schema({
 
    nome: {
        type: String,
        required: true
    },   

    telefone: {
        type: String,
       // required: true
    },  
    
    dataentrada: {
        type: String       
    },

    datasaida: {
        type: String        
    },

    descricao: {
        type: String        
    },


   
    created: {
        type: Date,
        default:  Date.now()
       // default: (new Date(), 'yyyy-mm-dd HH:MM:ss')
    }
    
}, {
    timestamps: { created: true, updatedAt: false }
})

//Chamado.plugin(AutoIncrement, {inc_field: 'numero'});

mongoose.model("chamado", Chamado)