//Carregando os módulo
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/CatChamados")
const CatChamados = mongoose.model('catchamados')
require("../models/Chamado")
const Chamado = mongoose.model('chamado')

require("../models/StatusChamado");
const StatusChamado = mongoose.model('statuschamado')

require("../models/InteracoesChamados");
const InteracoesChamados = mongoose.model('interacoeschamados')

//InteracoesChamados
require('dotenv').config()

const { getTransport, sendEmail } = require('../send-mail')

router.get('/', (req, res) => {
    // res.send("/teste")
    res.render("admin/cat-chamados")
})

router.get('/cat-chamados', (req, res) => {
    CatChamados.find().then((catchamados) => {
        res.render("admin/cat-chamados", { catchamados: catchamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria do chamado não foi encontrada!")
        res.render("admin/cat-chamados")
    })

})

router.get('/vis-cat-chamado/:id', (req, res) => {
    CatChamados.findOne({ _id: req.params.id }).then((catchamados) => {
        res.render("admin/vis-cat-chamado", { catchamados: catchamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria do chamado não foi encontrada!")
        res.render("admin/cat-chamados")
    })
})

// Visualizar status chamado
router.get('/vis-status-chamado/:id', (req, res) => {
    StatusChamado.findOne({ _id: req.params.id }).then((status) => {
        res.render("admin/vis-status-chamado", { status: status })
        console.log(status)
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria do chamado não foi encontrada!")
        res.render("admin/status")
    })

})

router.get('/cad-cat-chamado', (req, res) => {
    res.render("admin/cad-cat-chamado")
})

// Status do chamado

router.get('/cad-controles', (req, res) => {
    res.render("admin/cad-controles")
})

router.post('/add-cat-chamado', (req, res) => {
    var errors = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        errors.push({ error: "Necessário preencher o campo categoria" })
    }
    if (errors.length > 0) {
        res.render("admin/cad-cat-chamado", { errors: errors })
    } else {
        const addCatChamado = {
            nome: req.body.nome
        }
        new CatChamados(addCatChamado).save().then(() => {
            req.flash("success_msg", "Categoria de chamado cadastrada com sucesso!")
            res.redirect('/admin/cat-chamados')

        }).catch((erro) => {
            req.flash("error_msg", "Error: Categoria de chamado não cadastrada com sucesso!")
            res.redirect('/admin/cad-cat-chamado')
        })
    }
})


// Cadastro de status

router.post('/add-status-chamado', (req, res) => {
    var errors = []
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        errors.push({ error: "Necessário preencher o campo status" })
    }
    if (errors.length > 0) {
        res.render("admin/cad-controles", { errors: errors })
    } else {
        const addStatus = {
            descricao: req.body.descricao
        }
        new StatusChamado(addStatus).save().then(() => {
            req.flash("success_msg", "Status de chamado cadastrado com sucesso!")
            res.redirect('/admin/status')

        }).catch((erro) => {
            req.flash("error_msg", "Error: Status de chamado não cadastrado com sucesso!")
            res.redirect('/admin/status')
        })
    }
})

// Editar o status chamado
router.post('/update-status-chamado', (req, res) => {
    StatusChamado.findOne({ _id: req.body.id }).then((status) => {
        status.descricao = req.body.descricao
        status.save().then(() => {
            req.flash("success_msg", "Status de chamado editado com sucesso!")
            res.redirect("/admin/status")
        }).catch((erro) => {
            req.flash("error_msg", "Error: Status de chamado não encontrado!")
            res.redirect("/admin/status")
        })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Status de chamado não encontrado!")
        res.redirect("/admin/status")
    })
})

router.post('/update-cat-chamado', (req, res) => {
    CatChamados.findOne({ _id: req.body.id }).then((catchamados) => {
        catchamados.nome = req.body.nome
        catchamados.save().then(() => {
            req.flash("success_msg", "Categoria de chamado editada com sucesso!")
            res.redirect("/admin/cat-chamados")
        }).catch((erro) => {
            req.flash("error_msg", "Error: Categoria de chamado não encontrada!")
            res.redirect("/admin/cat-chamados")
        })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de chamado não encontrada!")
        res.redirect("/admin/cat-chamados")
    })
})

router.get('/del-cat-chamado/:id', (req, res) => {
    CatChamados.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Categoria de chamado apagado com sucesso!")
        res.redirect('/admin/cat-chamados')
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de chamado não apagada com sucesso!")
        res.redirect("/admin/cat-chamados")
    })
})

// Exclusão de status
router.get('/del-status-chamado/:id', (req, res) => {
    StatusChamado.deleteOne({ _id: req.params.id }).then(() => {
        req.flash("success_msg", "Status de chamado apagado com sucesso!")
        res.redirect('/admin/status')
    }).catch((erro) => {
        req.flash("error_msg", "Error: Status de chamado não apagada com sucesso!")
        res.redirect("/admin/status")
    })
})

// lista chamados
router.get('/chamados', (req, res) => {
    Chamado.find({}).populate("catchamados").then((chamados) => {
        res.render("admin/chamados", { chamados: chamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.render("admin/chamados")
    })
})


// Status
router.get('/controles', (req, res) => {
    StatusChamado.find().populate("statuschamado").then((status) => {
        res.render("admin/controles", { status: status })
        console.log(status)
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.render("admin/controles")
    })
})

router.get('/meuschamados', (req, res) => {
    Chamado.find({ status: 1 }).populate("catchamados").then((chamados) => {
        res.render("admin/meuschamados", { chamados: chamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.render("admin/meuschamados")
    })
})

router.get('/chamadosencerrados', (req, res) => {
    Chamado.find({ status: 5 }).populate("catchamados").then((chamados) => {
        res.render("admin/chamadosencerrados", { chamados: chamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.render("admin/chamadosencerrados")
    })
})

router.get('/vis-chamado/:id', (req, res) => {
    Chamado.findOne({ _id: req.params.id }).then((chamado) => {
        res.render("admin/vis-chamado", { chamado: chamado })
        console.log(chamado);
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.render("admin/chamados")
    })

})

router.get('/vis-chamadoencerrado/:id', (req, res) => {
    Chamado.findOne({ _id: req.params.id }).populate("catchamados").then((chamado) => {
        res.render("admin/vis-chamadoencerrado", { chamado: chamado })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.render("admin/chamados")
    })
})

router.get('/cad-chamado', (req, res) => {
    CatChamados.find().then((catchamados) => {
        res.render("admin/cad-chamado", { catchamados: catchamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: O formulário cadastrar chamado não pode ser carregado!")
        res.redirect("/admin/chamados")
    })
})

router.get('/cad-statuschamado', (req, res) => {
    CatChamados.find().then((catchamados) => {
        res.render("admin/cad-chamado", { catchamados: catchamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: O formulário cadastrar chamado não pode ser carregado!")
        res.redirect("/admin/chamados")
    })
})

router.post('/add-chamado', (req, res) => {
    var errors = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        errors.push({ error: "É necessário preencher o campo nome" })
    }
    if (!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null) {
        errors.push({ error: "É necessário preencher o campo descrição" })
    }

    // if (!req.body.catchamados || typeof req.body.catchamados == undefined || req.body.catchamados == null) {
    //     errors.push({ error: "É necessário preencher o campo categoria" })
    // }

    if (errors.length > 0) {
        res.render("admin/cad-chamado", { errors: errors })

    } else {
        const addChamado = {
            nome:        req.body.nome,
            telefone:    req.body.telefone,
            dataentrada: req.body.dataentrada,
            datasaida:   req.body.datasaida,
            descricao:   req.body.descricao
            //catchamados: req.body.catchamados
        }
        new Chamado(addChamado).save().then((params) => {
            // teste de envio de e-mail
            const config = {
                service: 'gmail',
                email: 'alonsoitservices@gmail.com',
                password: process.env.PASSWORD
            }
            const destination = {
                remetente: 'alonsoitservices@gmail.com',
                email: 'alonsosistemas@gmail.com',
                subject: 'Abertura de chamado'
            }
            const html = `<h2> Seu chamado foi aberto com sucesso. <br>` +

                `<h3> Número: ` + params.numero + `<br>` +
                `<h3> Assunto: ` + params.assunto + `<br>` +
                `<h3> Descrição: ` + params.descricao
            console.log(params)
            const transport = getTransport(config)
            sendEmail(transport)(destination, html)
                .then(response => console.log(response))
                .catch(err => console.log(err))
            // fim do teste de envio de e-mal        */
            req.flash("success_msg", "Chamado cadastrado com sucesso ")
            // req.flash("success_msg", "E-mail enviado com sucesso!")
            res.redirect('/admin/chamados')
        }).catch((erro) => {
            req.flash("error_msg", "Erro: Chamado não cadastrado")
            res.redirect('/admin/cad-chamado')
        })
    }
})


router.get('/del-chamado/:id', (req, res) => {
    Chamado.deleteOne({ _id: req.params.id }).then((params) => {
        req.flash("success_msg", "Chamado apagado com sucesso!")
        res.redirect("/admin/chamados")
        // teste de envio de e-mail
        const config = {
            service: 'gmail',
            email: 'alonsoitservices@gmail.com',
            password: process.env.PASSWORD
        }
        const destination = {
            remetente: 'alonsoitservices@gmail.com',
            email: 'alonsosistemas@gmail.com',
            subject: 'Exclusão de chamado'
        }
        const html = `<h2> O chamado ` + params.numero + req.params.numero + ` foi excluído. <br>`
        console.log(params)
        const transport = getTransport(config)
        sendEmail(transport)(destination, html)
            .then(response => console.log(response))
            .catch(err => console.log(err))
        // fim do teste de envio de e-mal        */
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não foi apagado com sucesso!")
        res.redirect("/admin/chamados")
    })
})


router.get('/edit-cat-chamado/:id', (req, res) => {
    CatChamados.findOne({ _id: req.params.id }).then((catchamados) => {
        res.render("admin/edit-cat-chamado", { catchamados: catchamados })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Categoria de pagamento não encontrado!")
        res.redirect("/admin/cat-pagamentos")
    })
})

// Tratamento da interação
router.get('/interacao-chamados/:id', (req, res) => {
    Chamado.findOne({ _id: req.params.id }).then((chamado) => {
        InteracoesChamados.find({ numerochamado: chamado.numero }).then((interacoeschamados) => {
            res.render("admin/interacao-chamados", { interacoeschamados: interacoeschamados, chamado: chamado })
           // console.log(interacoeschamados.tipotramite)

          



        }).catch((erro) => {
            req.flash("error_msg", "Error: Chamado não encontrado!")
            res.redirect("/admin/chamados")
        })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.redirect("/admin/chamados")
    })
})

// Interação - Trâmite recebido
router.get('/interacao-recebido/:id', (req, res) => {
    Chamado.findOne({ _id: req.params.id }).then((chamado) => {
        InteracoesChamados.find({ numerochamado: chamado.numero }).then((interacoeschamados) => {
            res.render("admin/interacao-recebido", { interacoeschamados: interacoeschamados, chamado: chamado })
        }).catch((erro) => {
            req.flash("error_msg", "Error: Chamado não encontrado!")
            res.redirect("/admin/chamados")
        })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.redirect("/admin/chamados")
    })
})


// Interação - Trâmite interno
router.get('/interacao-interno/:id', (req, res) => {
    Chamado.findOne({ _id: req.params.id }).then((chamado) => {
        InteracoesChamados.find({ numerochamado: chamado.numero }).then((interacoeschamados) => {
            res.render("admin/interacao-interno", { interacoeschamados: interacoeschamados, chamado: chamado })
        }).catch((erro) => {
            req.flash("error_msg", "Error: Chamado não encontrado!")
            res.redirect("/admin/chamados")
        })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.redirect("/admin/chamados")
    })
})

// Altera o chamado e insere a interação
router.post('/update-interacao-chamado', (req, res) => {
    Chamado.findOne({ _id: req.body.id }).then((chamado) => {
        chamado.assunto = req.body.assunto
        chamado.descricao = req.body.descricao
        chamado.save().then(() => {
            /*Inicio do tratamento*/

            const addInteracao = {
                textointeracao: req.body.textointeracao,
                numerochamado: req.body.numerochamado,
                tipotramite: req.body.tipotramite,
            }
            new InteracoesChamados(addInteracao).save().then((params) => {
                // teste de envio de e-mail
                const config = {
                    service: 'gmail',
                    email: 'alonsoitservices@gmail.com',
                    password: process.env.PASSWORD
                }
                const destination = {
                    remetente: 'alonsoitservices@gmail.com',
                    email: 'alonsosistemas@gmail.com',
                    subject: 'Resposta do chamado'
                }
                const html = `<h2> Nova resposta do chamado: ` + params.numerochamado + `<br>` +

                    `<h3> Número: ` + params.numerochamado + `<br>` +
                    `<h3> Assunto: ` + req.body.assunto + `<br>` +
                    `<h3> Resposta: ` + params.textointeracao
                console.log(params)
                const transport = getTransport(config)
                sendEmail(transport)(destination, html)
                    .then(response => console.log(response))
                    .catch(err => console.log(err))
                // fim do teste de envio de e-mal        */
            })

            /*Fim do tratamento*/
            req.flash("success_msg", "Trâmite enviado com sucesso!")
            res.redirect("/admin/meuschamados")

        }).catch((erro) => {
            req.flash("error_msg", "Error: Trâmite não enviado!")
            res.redirect("/admin/meuschamados")
        })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Trâmite não enviado!")
        res.redirect("/admin/meuschamados")
    })
})

// Edita status chamado
router.get('/edit-status-chamado/:id', (req, res) => {
    StatusChamado.findOne({ _id: req.params.id }).then((status) => {
        res.render("admin/edit-status-chamado", { status: status })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Status de chamado não encontrado!")
        res.redirect("/admin/status")
    })
})

// Assumir chamado
router.get('/assumir-chamado/:id', (req, res) => {
    Chamado.findOne({ _id: req.params.id }).then((chamado) => {
        res.render("admin/assumir-chamado", { chamado: chamado })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Status de chamado não encontrado!")
        res.redirect("/admin/status")
    })
})


// Assumir chamado
// Implementando


router.post('/update-assumir-chamado', (req, res) => {
    Chamado.findOne({ _id: req.body.id }).then((chamado) => {
        chamado.status = 1
        chamado.save().then(() => {
            req.flash("success_msg", "Você assumiu o chamado: " + chamado.numero)
            res.redirect("/admin/meuschamados")
        })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Não foi possível assumir o chamado!")
        res.redirect("/admin/meuschamados")
    })
})

router.post('/update-reabri-chamado', (req, res) => {
    Chamado.findOne({ _id: req.body.id }).then((chamado) => {
        chamado.status = 1
        chamado.save().then(() => {
            res.render("admin/chamados", { chamado: chamado })
        })
    }).catch((erro) => {
        req.flash("error_msg", "Error: Chamado não encontrado!")
        res.redirect("/vis-chamadoencerrado")
    })
})

//Teste de cadastro de interação

router.get('/cad-interacaoteste', (req, res) => {
    res.render("admin/cad-interacaoteste")
})

router.post('/add-interacaoteste', (req, res) => {
    var errors = []
    if (!req.body.textointeracao || typeof req.body.textointeracao == undefined || req.body.textointeracao == null) {
        errors.push({ error: "Necessário preencher o campo categoria" })
    }
    if (errors.length > 0) {
        res.render("admin/cad-interacaoteste", { errors: errors })
    } else {
        const addInteracao = {
            textointeracao: req.body.textointeracao,
            numerochamado: req.body.numerochamado
        }
        new InteracoesChamados(addInteracao).save().then(() => {
            req.flash("success_msg", "Categoria de chamado cadastrada com sucesso!")
            res.redirect('/admin/cad-interacaoteste')

        }).catch((erro) => {
            req.flash("error_msg", "Error: Categoria de chamado não cadastrada com sucesso!")
            res.redirect('/admin/cad-interacaoteste')
        })
    }
})

module.exports = router