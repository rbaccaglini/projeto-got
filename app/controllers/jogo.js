module.exports.jogo = function(application, req, res){
    if(!req.session.autorizado){
        res.render("index", {validacao: [{msg: "Só pra usuário autenticados"}]})
        return
    }

    let msg = ''

    if(req.query.msg != '') {
        msg = req.query.msg
    }

    const conn = application.config.dbconn
    const jogoDAO = new application.app.models.JogoDAO(conn)
    jogoDAO.iniciaJogo(res, req.session.usuario, req.session.casa, msg)
}

module.exports.sair = function(application, req, res){
    req.session.destroy(function(err){
        res.render("index", {validacao:{}})
    })
}

module.exports.pergaminhos = function(application, req, res){
    if(!req.session.autorizado){
        res.render("index", {validacao: [{msg: "Só pra usuário autenticados"}]})
        return
    }

    const conn = application.config.dbconn
    const jogoDAO = new application.app.models.JogoDAO(conn)
    const usuario = req.session.usuario
    jogoDAO.getAcoes(usuario, res)

    //res.render("pergaminhos", {validacao:{}})
}

module.exports.aldeoes = function(application, req, res){
    if(!req.session.autorizado){
        res.render("index", {validacao: [{msg: "Só pra usuário autenticados"}]})
        return
    }
    res.render("aldeoes", {validacao:{}})
}

module.exports.ordenar_acao_aldeoes = function(application, req, res){
    
    if(!req.session.autorizado){
        res.render("index", {validacao: [{msg: "Só pra usuário autenticados"}]})
        return
    }

    const dadosForm = req.body

    req.assert('acao','Informe a ação desejada').notEmpty()
    req.assert('quantidade','Informe a quantidade').notEmpty()

    const err = req.validationErrors()
    if(err) {
        res.redirect('jogo?msg=err')
        return
    }

    const conn = application.config.dbconn
    const jogoDAO = new application.app.models.JogoDAO(conn)
    dadosForm.usuario = req.session.usuario
    jogoDAO.acao(dadosForm)

    res.redirect('jogo?msg=ok')
}

module.exports.revogar_acao = function(application, req, res){
    const url_query = req.query
    const conn = application.config.dbconn
    const jogoDAO = new application.app.models.JogoDAO(conn)
    jogoDAO.revogarAcao(url_query.id, res)
}