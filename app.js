//Carregando os módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express();
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require('mongoose')
const flash = require('connect-flash')//
const session = require('express-session')
const consign = require('consign');
require('dotenv').config()


//Configurações 
/*
//Sessão */
app.use(session({
    secret: 'testtesttestee', resave: true, saveUninitialized: true,  }))

//Flash 
app.use(flash()) 

//Midddleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
}) 

//Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: "main" }))
app.set("view engine", 'handlebars', {

})

//conexão com o banco de dados
mongoose.connect('mongodb://localhost/aitservices_BRUMADO1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conexão com MongoDB realizado com sucesso...")
}).catch((erro) => {
    console.log("Erro: Conexão com MongoDB não foi realizado com sucesso: " + erro)
})

//Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")))

//Rotas
app.use('/admin', admin)
app.listen(process.env.SERVER_PORT || 3000, function(){
    console.log('rodando na porta ', process.env.SERVER_PORT);
});